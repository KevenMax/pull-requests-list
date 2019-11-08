import React, { useState, useEffect } from "react";
import { faCodeBranch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToastContainer, toast } from "react-toastify";
import { format } from "date-fns";
import api from "../../services";
import "./styles.css";

function Main() {
  const [repository, setRepository] = useState("");
  const [validRepo, setValidRepo] = useState(true);
  const [pullRequests, setPullRequest] = useState([]);

  useEffect(() => {
    function noticeWelcome() {
      toast.info("Welcome to pull request list!", toast.POSITION.TOP_RIGHT);
    }
    noticeWelcome();
  }, []);

  const handleSetRepository = text => {
    setRepository(text);
    setValidRepo(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!repository) {
      toast.error(
        "Please fill in the repository field",
        toast.POSITION.TOP_RIGHT
      );
      setValidRepo(false);
    } else {
      try {
        const request = await api.get(`/repos/${repository}/pulls`);
        setPullRequest(request.data);
        console.log(request.data);
      } catch (error) {
        console.log(error);
        toast.error("Ops... Error in api request", toast.POSITION.TOP_RIGHT);
      }
    }
  };

  return (
    <section id="main">
      <h1>Pull Requests List</h1>
      <h2>Enter user and repository to view pull requests</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Repository"
          spellCheck="false"
          onChange={text => handleSetRepository(text.target.value)}
          className={!validRepo ? "borderError" : ""}
        />
        <button>SEARCH</button>
      </form>
      <div className="list-items">
        {pullRequests.map((pullRequest, index) => (
          <div className="item" key={index}>
            <div className="header-item">
              <FontAwesomeIcon icon={faCodeBranch} />
              <a
                href={pullRequest.html_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {pullRequest.title}
              </a>
              {pullRequest.labels.map((label, index) => (
                <span
                  key={index}
                  style={{ backgroundColor: `#${label.color}` }}
                >
                  {label.name}
                </span>
              ))}
            </div>
            <p>
              #{pullRequest.number} opened on{" "}
              {format(new Date(pullRequest.created_at), "dd MMM")} by{" "}
              {pullRequest.user.login}
            </p>
          </div>
        ))}
      </div>
      <ToastContainer />
    </section>
  );
}

export default Main;
