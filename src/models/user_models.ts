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

export type UserState = {
    user: string | null;
    setUser: (user: any) => void;
    loading: boolean;
}

export type LoginData = {username: string, password: string};