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
    user: UserData | undefined;
    setUser: (user: any) => void;
    loading: boolean;
}

export type UserData = {id: string; username: string, password: string};
export type UserPayload = Omit<UserData, 'id'> & {
    rePassword?: string;
}

export type UserBoulderData = {
    total_sessions: number;
    current_progress: number;
    total_attempts: number;
    date_completed: string | null;
    last_date_climbed: string;
}