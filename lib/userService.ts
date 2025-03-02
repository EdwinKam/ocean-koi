import User from "@/model/user";
import { GetBatchUserPublicDataRequest } from "@/model/whaleRequests";

// Initialize the user cache as a Record
const userCache: Record<string, User> = {};

// Function to update the cache with new user data
function updateUserCache(users: User[]) {
  users.forEach((user) => {
    userCache[user.uid] = user;
  });
}

export async function getBatchUser(
  request: GetBatchUserPublicDataRequest,
): Promise<Record<string, User>> {
  // Filter out userIds that are already in the cache
  const uncachedUserIds = request.userIds.filter((id) => !userCache[id]);

  // If all users are cached, return them directly as a record
  if (uncachedUserIds.length === 0) {
    return request.userIds.reduce(
      (acc, id) => {
        acc[id] = userCache[id];
        return acc;
      },
      {} as Record<string, User>,
    );
  }

  // Construct the query string with uncached userIds
  const queryParams = uncachedUserIds
    .map((id) => `userIds=${encodeURIComponent(id)}`)
    .join("&");
  const url = `${process.env.EXPO_PUBLIC__BACKEND_HOST}/api/user/getBatchUserPublicData?${queryParams}`;

  console.log("calling " + url);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
      accessToken: request.accessToken,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `HTTP error! status: ${response.status}, details: ${errorText}`,
    );
  }

  const data = await response.json();
  const fetchedUsers = data.userPublicDataList as User[];

  // Update the cache with the newly fetched users
  updateUserCache(fetchedUsers);

  // Return all requested users, combining cached and newly fetched as a record
  return request.userIds.reduce(
    (acc, id) => {
      acc[id] = userCache[id];
      return acc;
    },
    {} as Record<string, User>,
  );
}
