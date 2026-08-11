export type UserStats = {
    total_sessions: number;
    highest_grade: number;
    avg_sent_grade: number;
    most_frequented_gym: string;
    sends_by_grade: SendsByGrade[];
};

export type SendsByGrade = {
    vgrade: number;
    sends: number
}

export type UserState = {
    user: string | undefined;
    setUser: (user: any) => void;
    loading: boolean;
}

export type UserData = {username: string, password: string};