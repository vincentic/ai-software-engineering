import TodoDetailClient from "../../components/TodoDetailClient";

export default async function TodoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TodoDetailClient todoId={id} />;
}
