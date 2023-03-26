import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { api, RouterOutputs } from "~/utils/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="flex w-full gap-2  p-2">
      <Image
        className="h-14 w-14 rounded-full"
        src={user.profileImageUrl}
        alt="Profile Image"
        width={56}
        height={56}
      />
      <input
        className="grow bg-transparent placeholder-white outline-none"
        placeholder="Type 4 Letters only here!"
      />
    </div>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div className="flex flex-row gap-5 border-b p-4">
      {author?.profileImageUrl && (
        <Image
          className="h-12 w-12 rounded-full"
          src={author.profileImageUrl}
          alt="Profile Image"
          width={48}
          height={48}
        />
      )}
      <div className="flex flex-col self-center">
        <span className="text-sm">
          {author.username
            ? `@${author.username}`
            : author.firstName + " " + author.lastName}
          <span className="px-1">·</span>
          <span className="text-xs">{dayjs(post.createdAt).fromNow()}</span>
        </span>
        <span className="text-xl">{post.content}</span>
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const user = useUser();
  console.log(user);

  const { data, isLoading } = api.posts.getAll.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Something went wrong</div>;
  }

  return (
    <>
      <Head>
        <title>Twit</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex h-screen justify-center">
        <div className=" h-full w-full border-x bg-blue-400 md:max-w-xl">
          <div className="">
            {!!user.isSignedIn && <CreatePostWizard />}
            {!user.isSignedIn && <SignInButton />}
          </div>
          <div className="flex flex-col">
            {data.map((fullPost) => (
              <PostView {...fullPost} key={fullPost.post.id} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
