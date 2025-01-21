import Navbar from "../components/Navbar.jsx";
import NewWorkshop from "../components/NewWorkshop.jsx";
import UpdateProduct from "../components/UpdateProduct.jsx";
import { useParams } from "react-router-dom";

export default function WorkshopActions(props) {
  const { id } = useParams();

  return (
    <div className="flex gap-3 w-full ">
      <Navbar />
      <div className="w-full flex justify-center">
        {props.add ? <NewWorkshop /> : <UpdateProduct id={id} />}
      </div>
    </div>
  );
}
