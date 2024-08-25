import { Button } from "@mui/material";
import { useQuestionsStore } from "./store/questions";

export const Footer = () => {
  const questions = useQuestionsStore((state) => state.questions);
  const reset = useQuestionsStore((state) => state.reset);

  let correctAnswers = 0;
  let incorrectAnswers = 0;
  let unansweredQuestions = 0;

  questions.forEach((question) => {
    const { userSelectedAnswer, correctAnswer } = question;
    if (userSelectedAnswer == null) unansweredQuestions++;
    else if (userSelectedAnswer === correctAnswer) correctAnswers++;
    else incorrectAnswers++;
  });

  return (
    <footer>
      <strong>
        ✅ {correctAnswers} correctas | ❌ {incorrectAnswers} incorrectas | ❓
        {unansweredQuestions} sin responder
      </strong>
      <div style={{ marginTop: "16px" }}>
        <Button onClick={() => reset()}>Volver a empezar</Button>
      </div>
    </footer>
  );
};
