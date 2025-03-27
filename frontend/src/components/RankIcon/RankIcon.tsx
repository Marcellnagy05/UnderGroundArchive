import "./RankIcon.css"

interface RankIconProps{
    rank: string; 
}

export const RankIcon: React.FC<RankIconProps> = ({ rank }) => {
    return (
      <div
        className="rankPicture"
        style={{
          backgroundImage: `url(/images/Ranks/${rank}.png)`,
        }}
      />
    );
  };
  
  