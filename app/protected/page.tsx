import { redirect } from "next/navigation";

export default function ProtectedPage() {
  // 登录后直接重定向到历史记录页面
  redirect("/protected/readings");
}