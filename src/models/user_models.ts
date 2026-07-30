export type UserStats = {
    total_sessions: number;
    highest_grade: number;
    avg_grade_sent: number;
    most_frequented_gym: string;
    sends_by_grade: SendsByGrade[];
};

type SendsByGrade = {
    vgrade: number;
    sends: number
}