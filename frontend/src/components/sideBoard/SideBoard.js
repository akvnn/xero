import Searchbar from "../searchBar/SearchBar";
import FollowersBoard from "../followersBoard/FollowersBoard";
import "./SideBoard.css";

const SideBoard = () => {
  return (
    <section className="section search">
      <Searchbar />
      <div className="searchResults" id="searchResults"></div>
      <FollowersBoard />
    </section>
  );
};

export default SideBoard;
