import { UserProfile } from "@clerk/nextjs";

const UserProfilePage = () => (
  <div className="flex h-full w-full items-center justify-center">
    <UserProfile />
  </div>
);

export default UserProfilePage;
