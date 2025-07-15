import { QuestionItem } from "./question-item";
import { useRoomQuestions } from "@/services/use-room-questions";
import { Loader2 } from "lucide-react";
type  QuestionListProps = {
  id: string
}

export function QuestionList(props: QuestionListProps) {
  const { data, isLoading } = useRoomQuestions(props.id)
  return (
    <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="font-semibold text-2xl text-foreground">
        Perguntas & Respostas
      </h2>
    </div>

    {isLoading && <div className="flex items-center justify-center">
      <Loader2 className="size-4 animate-spin" />
    </div>}
    {data?.map((question) => (
      <QuestionItem key={question.id} question={question} />
    ))}
  </div>)
}