import TodoEditClient from "../../../components/TodoEditClient";

export default async function TodoEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TodoEditClient todoId={id} />;
}
