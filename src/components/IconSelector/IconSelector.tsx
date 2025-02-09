import { FaList } from "react-icons/fa";
import RankSelector from "../RankSelector/RankSelector";
import { UserProfile } from "../../Types/UserProfile";


interface IconSelectorProps {
    userProfile: UserProfile;
    selectedPictureId: number;
    setSelectedPictureId: (id: number) => void;
}

const IconSelector: React.FC<IconSelectorProps> = ({ userProfile, selectedPictureId, setSelectedPictureId }) => {
    return (
        <div className="setting-item rank-selector">
            <div className="setting-icon">
                <FaList />
            </div>
            <div className="setting-content">
                <strong>Ikonválasztó</strong>
            </div>
            <RankSelector
                userProfile={userProfile}
                selectedPictureId={selectedPictureId}
                setSelectedPictureId={setSelectedPictureId}
            />
        </div>
    );
};

export default IconSelector;
