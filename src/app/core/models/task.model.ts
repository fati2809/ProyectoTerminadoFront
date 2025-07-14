export interface Task {
  id?: number;
  name: string;
  description: string;
  created_at: string;
  dead_line: string;
  status: string;
  is_alive: boolean;
  created_by: string;
}

export interface RespuestaTareas {
  statusCode: number;
  intData?: {
    message: string;
    data: Task[];
  };
}
