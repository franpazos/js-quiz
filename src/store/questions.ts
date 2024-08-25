import { create } from "zustand";
import { Question } from "../types";
import confetti from "canvas-confetti";
import { persist } from "zustand/middleware";

interface State {
  questions: Question[];
  currentQuestionIndex: number;
  fetchQuestions: (limit: number) => Promise<void>;
  selectAnswer: (questioId: number, answerIndex: number) => void;
  goNextQuestion: () => void;
  goPreviousQuestion: () => void;
  reset: () => void;
}

export const useQuestionsStore = create<State>()(
  persist(
    (set, get) => {
      return {
        questions: [],
        currentQuestionIndex: 0,

        fetchQuestions: async (limit: number) => {
          const res = await fetch("http://localhost:5173/data.json");
          const json = await res.json();

          const questions = json
            .sort(() => Math.random() - 0.5)
            .slice(0, limit);
          set({ questions });
        },

        selectAnswer: (questionId, answerIndex) => {
          const { questions } = get();
          // usar el structuredClone para clonar el objeto y no mutar el original
          const newQuestions = structuredClone(questions);
          // encontrar el indice de la pregunta
          const questionIndex = newQuestions.findIndex(
            (q) => q.id === questionId
          );
          // obtenemos la información de la pregunta
          const questionInfo = newQuestions[questionIndex];
          // averiguamos si la respuesta del usuario es correcta
          const isCorrectUserAnswer =
            questionInfo.correctAnswer === answerIndex;
          if (isCorrectUserAnswer) confetti();
          // cambiar esta información en la copia de la pregunta
          newQuestions[questionIndex] = {
            ...questionInfo,
            isCorrectUserAnswer,
            userSelectedAnswer: answerIndex,
          };
          // actualizar el estado
          set({ questions: newQuestions });
        },

        goNextQuestion: () => {
          const { questions, currentQuestionIndex } = get();
          const nextQuestion = currentQuestionIndex + 1;

          if (nextQuestion < questions.length) {
            set({ currentQuestionIndex: nextQuestion });
          }
        },

        goPreviousQuestion: () => {
          const { currentQuestionIndex } = get();
          const previousQuestion = currentQuestionIndex - 1;

          if (previousQuestion >= 0) {
            set({ currentQuestionIndex: previousQuestion });
          }
        },

        reset: () => {
          set({ questions: [], currentQuestionIndex: 0 });
        },
      };
    },
    { name: "questions" }
  )
);
