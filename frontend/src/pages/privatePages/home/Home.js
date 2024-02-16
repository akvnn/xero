/* eslint-disable react/no-unknown-property */
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./Home.css";

const Home = () => {
  return (
    <section className="section home" id="home">
      <Link>
        <h1 className="targetHeading">
          {" "}
          <FaArrowLeft className="horizontal-spacing1" />
          Home
        </h1>
      </Link>
      <div className="messagesViewHidden">
        <div className="messageProfile">
          <div className="messageViewProfilePictureContainer">
            <img src="https://picsum.photos/200" alt="" className="messageViewProfilePicture" />
          </div>
          <div className="messageViewInfo">
            <div className="messageViewHeader">
              <h3 className="messageViewName">John Doe</h3>
              <p className="messageViewUsername">@johndoe</p>
              <p className="messageViewDate">May 17</p>
            </div>
            <p className="lastMessage">Lorem ipsum dolor sit amet.</p>
          </div>
        </div>
      </div>
      <div className="profileHeader">
        <div className="backColumn">
          <i className="fa-solid fa-arrow-left"></i>
        </div>
        <div className="profileBanner">
          <img
            src="https://picsum.photos/200"
            alt=""
            className="profileBannerPic"
            id="profileBannerPic"
          />
        </div>
        <div className="imgAndEdit">
          <img
            src="https://picsum.photos/200"
            alt=""
            className="mainProfilePic"
            id="mainProfilePic"
          />
          <button className="btn editProfileButton" id="editProfileButton">
            Message
          </button>

          <button className="btn editProfileButton" id="editProfileButton">
            Follow
          </button>
        </div>

        <div className="mainProfileNameDiv">
          <h3 className="mainProfileName" id="mainProfileName">
            Akvn
          </h3>
          <p className="mainProfileUsername" id="mainProfileUsername">
            @ak
          </p>
          <p className="bio" id="bio">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus recusandae sapiente
            cupiditate molestiae harum, deleniti quaerat quisquam labore itaque vitae?
          </p>
        </div>
        <div className="profileCount">
          <div className="countItem">
            <p className="countNumber" id="followingCount">
              0
            </p>
            <p className="countText">Following</p>
          </div>
          <div className="countItem">
            <p className="countNumber" id="followersCount">
              0
            </p>
            <p className="countText">Followers</p>
          </div>
          <div className="countItem">
            <p className="countNumber" id="tweetsCount">
              0
            </p>
            <p className="countText">Tweets</p>
          </div>
        </div>
        <div className="profileNavigationButtons">
          <button className="followingButton profileNavButton" id="profileNavButtonPosts">
            Posts
          </button>
          <button className="followingButton profileNavButton" id="profileNavButtonReplies">
            Replies
          </button>
          <button className="followingButton profileNavButton" id="profileNavButtonLikes">
            Likes
          </button>
        </div>
      </div>
      <div className="profileTweets" id="profileTweets"></div>

      <button className="followingButton">Following</button>
      <div className="tweets" id="tweets">
        <div className="tweet">
          <div className="tweetContent">
            <div className="profileName">
              <img src="https://picsum.photos/200" alt="" className="tweetProfilePic" />
              <h3 className="tweetName">John Doe</h3>
              <p className="tweetUsername">@johndoe</p>
              <p className="tweetTime">28m</p>
            </div>
            <div className="tweetText">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum, amet consequuntur
              ipsam qui deserunt quod ex adipisci minus quos Link.
            </div>
            <div className="tweetChoices">
              <p className="tweetChoice">
                <i className="fa-regular fa-comment"></i> 2
              </p>
              <p className="tweetChoice">
                <i className="fa-solid fa-retweet"></i> 7
              </p>
              <p className="tweetChoice">
                <i className="fa-regular fa-heart"></i> 12
              </p>
            </div>
            <div className="tweetCommentsHidden">
              <div className="tweet">
                <div className="tweetContent">
                  <div className="profileName">
                    <img src="https://picsum.photos/100" alt="" className="tweetProfilePic" />
                    <h3 className="tweetName">x x</h3>
                    <p className="tweetUsername">@xx</p>
                    <p className="tweetTime" dateCreated="">
                      28m
                    </p>
                  </div>
                  <div className="tweetText">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum magni expl
                  </div>
                  <div className="tweetChoices">
                    <p className="tweetChoice">
                      <i className="fa-regular fa-comment"></i> 2
                    </p>
                    <p className="tweetChoice">
                      <i className="fa-solid fa-retweet"></i> 7
                    </p>
                    <p className="tweetChoice">
                      <i className="fa-regular fa-heart"></i> 12
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="tweet">
          <div className="tweetContent">
            <div className="profileName">
              <img src="https://picsum.photos/100" alt="" className="tweetProfilePic" />
              <h3 className="tweetName">x x</h3>
              <p className="tweetUsername">@xx</p>
              <p className="tweetTime" dateCreated="">
                28m
              </p>
            </div>
            <div className="tweetText">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum magni explicabo esse
              obcaecati vero optio, odio deserunt, cumque, dolor debitis reprehenderit beatae
              mollitia vel saepe incidunt quis id sunt. Aperiam modi laudantium porro autem neque
              deleniti optio, numquam eum, sint aliquam consequuntur, assumenda quos nesciunt! Harum
              ad ut nobis explicabo accusantium aliquam tempore suscipit, cupiditate culpa modi,
              quisquam mollitia, enim vero? Ea ex officiis quia mollitia perferendis doloribus
              numquam amet beatae quibusdam, blanditiis unde, at explicabo rem ducimus tempore
              suscipit cumque est nam quod corrupti? Voluptatum impedit, porro hic, eos, velit
              fugiat voluptatem id et quibusdam numquam voluptas quisquam incidunt! Link.
            </div>
            <div className="tweetChoices">
              <p className="tweetChoice">
                <i className="fa-regular fa-comment"></i> 2
              </p>
              <p className="tweetChoice">
                <i className="fa-solid fa-retweet"></i> 7
              </p>
              <p className="tweetChoice">
                <i className="fa-regular fa-heart"></i> 12
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
