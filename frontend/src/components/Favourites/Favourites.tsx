import { useState } from "react";
import { addFavourite, deleteFavourite } from "../../services/BookServices";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";

interface FavouritesProps {
  bookId: number;
  chapterId: number;
  isFavourite: boolean;
  onFavouriteChange: (bookId: number, isFavourite: boolean) => void;
}

const Favourites = ({bookId, chapterId, isFavourite, onFavouriteChange }: FavouritesProps) => {
  const [favourite, setFavourite] = useState<boolean>(isFavourite);

  const handleAddFavourite = async () => {
    try {
      const response = await addFavourite(bookId).catch(err => {
        console.error("Hiba a fetch során:", err);
        return null;
      });

      if (!response) {
        console.error("A fetch nem adott vissza response-t!");
        return;
      }


      if (response.ok) {  
        const jsonData = await response.json().catch(() => null);
        console.log("Szerver válasz:", jsonData);
        console.log("HTTP Status:", response.status);
      }
      
      const newFavouriteState = !favourite;
      setFavourite(newFavouriteState);
      onFavouriteChange(bookId, newFavouriteState);
  
    } catch (error) {
      console.error("Hiba a kedvencek mentésekor:", error);
    }
};

const handledeleteFavourite = async () => {
  try {
    const response = await deleteFavourite(bookId).catch(err => {
      console.error("Hiba a fetch során:", err);
      return null;
    });

    if (!response) {
      console.error("A fetch nem adott vissza response-t!");
      return;
    }

    if (response.ok) {  
      const jsonData = await response.json().catch(() => null);
    }
    
    const newFavouriteState = !favourite;
    setFavourite(newFavouriteState);
    onFavouriteChange(bookId, newFavouriteState);

  } catch (error) {
    console.error("Hiba a kedvencek törlésekor:", error);
  }
};

  

  return (
    <button onClick={favourite ? handledeleteFavourite : handleAddFavourite} style={{ background: "none", border: "none", cursor: "pointer" }}>
      {favourite ? <BsBookmarkFill size={24} color="gold" /> : <BsBookmark size={24} />}
    </button>
  );
};

export default Favourites;
