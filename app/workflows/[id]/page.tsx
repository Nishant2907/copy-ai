import WorkflowEditor from "./WorkflowEditor";

export default async function WorkflowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <WorkflowEditor id={id} />;
}
