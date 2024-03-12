import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getCommentById } from "@/lib/api/comments/queries";
import { getPatients } from "@/lib/api/patients/queries";import OptimisticComment from "@/app/(app)/comments/[commentId]/OptimisticComment";
import { checkAuth } from "@/lib/auth/utils";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function CommentPage({
  params,
}: {
  params: { commentId: string };
}) {

  return (
    <main className="overflow-auto">
      <Comment id={params.commentId} />
    </main>
  );
}

const Comment = async ({ id }: { id: string }) => {
  await checkAuth();

  const { comment } = await getCommentById(id);
  const { patients } = await getPatients();

  if (!comment) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="comments" />
        <OptimisticComment comment={comment} patients={patients}
        patientId={comment.patientId} />
      </div>
    </Suspense>
  );
};
