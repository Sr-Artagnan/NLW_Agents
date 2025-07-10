import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { dayjs } from "@/lib/format-relative-date";
import { ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "./ui/badge";
import { useRooms } from "@/services/use-rooms";


export function RoomList() { 
 const { data, isLoading } = useRooms();

 return(
  <Card>
  <CardHeader>
    <CardTitle>Salas recentes</CardTitle>      
  <CardDescription>
    Acesso rápido para as salas criadas recentemente
  </CardDescription>
  </CardHeader>
  <CardContent className="flex flex-col gap-3">
    {isLoading && (
      <div className="flex items-center justify-center">
        <Loader2 className="size-4 animate-spin" />
      </div>
    )}

    {data?.map((room) => {
    return (
      <Link key={room.id}  to={`/room/${room.id}`}>
      <div 
      className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50"
      >
      <div className="flex w-full flex-col gap-1">

        <div className="w-full flex items-center justify-between">
        <h3 className="text-lg font-semibold">{room.name}</h3>
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          Entrar
          <ArrowRight className="size-3" />
        </span> 
        </div> 
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">{room.questionsCount} Perguntas</Badge>
          <Badge variant="secondary" className="text-xs">
            {dayjs(room.createdAt).toNow()}
            </Badge>
        </div>    
        </div>
      </div>
      </Link>
    );
    })}

  </CardContent>
</Card>
 )
  
}