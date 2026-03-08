export type Employee = {
  id: string;
  name: string;
  role: string;
  department: string;
  avatarColor: string;
};

export const employees: Employee[] = [
  {
    id: "e1",
    name: "Анна Петрова",
    role: "Team Lead",
    department: "Разработка",
    avatarColor: "#f97316"
  },
  {
    id: "e2",
    name: "Иван Смирнов",
    role: "Backend Engineer",
    department: "Разработка",
    avatarColor: "#22c55e"
  },
  {
    id: "e3",
    name: "Мария Ковалёва",
    role: "Product Manager",
    department: "Продукт",
    avatarColor: "#3b82f6"
  },
  {
    id: "e4",
    name: "Дмитрий Орлов",
    role: "HR Business Partner",
    department: "HR",
    avatarColor: "#a855f7"
  },
  {
    id: "e5",
    name: "Сергей Николаев",
    role: "DevOps Engineer",
    department: "Инфраструктура",
    avatarColor: "#ec4899"
  }
];

export const getInitials = (fullName: string) => {
  const [first, second] = fullName.split(" ");
  return (first?.[0] ?? "") + (second?.[0] ?? "");
};

