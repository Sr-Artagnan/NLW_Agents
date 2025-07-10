import { Navigate, useParams } from "react-router-dom";

type RoomParams = {
  id: string;
};

export function Room() {
  const params = useParams<RoomParams>();

  if (!params.id || params.id === "") {
    return <Navigate replace to="/" />;
  }

  return (
    <div>
      <p>Id: {params.id}</p>
    </div>
  );
}
