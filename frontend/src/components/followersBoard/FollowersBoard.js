import "./FollowersBoard.css";

const FollowersBoard = () => {
  return (
    <>
      <div className="whoToFollow" id="whoToFollow">
        <h4 className="whoToFollowHeading">Who To Follow?</h4>
        <div className="suggestionAccount">
          <img src="https://picsum.photos/200" alt="" className="suggestionImg" />
          <h3 className="suggestionName">John Doe</h3>
          <p className="suggestionUsername">@johndoe</p>
          <button className="followButton">Follow</button>
        </div>
        <div className="suggestionAccount">
          <img src="https://picsum.photos/200" alt="" className="suggestionImg" />
          <h3 className="suggestionName">akvn</h3>
          <p className="suggestionUsername">@akvn</p>
          <button className="followButton">Follow</button>
        </div>
        <div className="suggestionAccount">
          <img src="https://picsum.photos/200" alt="" className="suggestionImg" />
          <h3 className="suggestionName">bonga</h3>
          <p className="suggestionUsername">@duokobia</p>
          <button className="followButton">Follow</button>
        </div>
      </div>
    </>
  );
};

export default FollowersBoard;
