import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticle, setCurrentArticle] = useState(null)
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()

  const redirectToLogin = () => { 
    navigate('/');
  }
  const redirectToArticles = () => { 
    navigate('/articles')
  
   }

  const logout = () => {
   const token = localStorage.getItem("token");

   if(token) {
    localStorage.removeItem('token')
   }
   setMessage("Goodbye!");

  redirectToLogin();
  
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
  }

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    // Flush the message state
    setMessage('');
    setSpinnerOn(true);
     

    axios
      .post(loginUrl, { username, password })
      .then((response) => {
        const { token, message } = response.data;

  
        localStorage.setItem("token", token);

        console.log('login message', message)

        setMessage(message);
       
        redirectToArticles();
      
      })
      .catch((error) => {
        console.error("An error occurred during login:", error);
        setMessage("An error occured during login");
      })
      .finally(() => {
        setSpinnerOn(false);
      });
  
  }

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    setMessage("");
     setSpinnerOn(true);
     const token = localStorage.getItem('token')
     axios
       .get(articlesUrl, {
         headers: { Authorization: token },
       })
       .then((response) => {
         const { articles, message } = response.data;
         setArticles(articles);
          console.log('GET Articles message:',message)
         setMessage(message)
       })
       .catch((error) => {
         console.error("An error occurred while fetching articles:", error);
         if (error.response && error.response.status === 401) {
           // Token might have gone bad, redirect to login
           setMessage("Unauthorized. Redirecting to login...");
           redirectToLogin();
         } else {
           setMessage("An error occurred while fetching articles");
         }
       })
       .finally(() => {
         setSpinnerOn(false);
       });
      
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
  }

  const postArticle = article => {
    setMessage('');
    setSpinnerOn(true);
    const token = localStorage.getItem("token");
    axios 
    .post(articlesUrl, article, {
      headers: {Authorization: token}
    })
    .then(response => {
     const {message} = response.data

      console.log("postArticles message", message)

      setMessage(message);

      setArticles([...articles, article])
      

      
    })
    .catch(error => {
      console.error('An error occurred while posting article:', error);
      setMessage("An error occurred while posting article");
    })
    .finally(() => {
      setSpinnerOn(false)
    })

    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
  }

  const updateArticle = ({ article_id, article }) => {
    setMessage("");
    setSpinnerOn(true);
    const token = localStorage.getItem("token");

    console.log("Article ID:", article_id); // Log the article ID
    console.log("Updated Article Data:", article); // Log the updated article data

    axios
      .put(`${articlesUrl}/${article_id}`, article, {
        headers: { Authorization: token },
      })
      .then((response) => {
        const { message } = response.data;
        console.log(message);
        setMessage(message);
          setArticles(
            articles.map((art) => {
              if (art.article_id === article_id) {
                return { ...art, ...article };
              }
              return art;
            })
          )

        console.log("Updated Article from server:", response.data);
      })
      .catch((error) => {
        console.log(error);
        setMessage("An error occurred while updating article");
      })
      .finally(() => {
        setSpinnerOn(false);
      });

    // ✨ implement
    // You got this!
  }

  const deleteArticle = article_id => {
     setMessage("");
     setSpinnerOn(true);
     const token = localStorage.getItem('token');
     axios.delete(`${articlesUrl}/${article_id}`, {
      headers: {Authorization: token}
     })
     .then(response => {
      const {message} = response.data
      // console.log(message)
      setMessage(message)
     
      setArticles(articles.filter((art) => art.article_id !== article_id))
      

     })
     .catch((error) => {
    console.log(error)
     })
     .finally(() => {
       setSpinnerOn(false);
     })

    // ✨ implement
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />

      <button id="logout" onClick={logout}>
        Logout from app
      </button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
        {" "}
        {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">
            Login
          </NavLink>
          <NavLink id="articlesScreen" to="/articles">
            Articles
          </NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route
            path="articles"
            element={
              <>
                <ArticleForm
                  postArticle={postArticle}
                  updateArticle={updateArticle}
                  setCurrentArticle={setCurrentArticle}
                  currentArticle={currentArticle}
                />
                <Articles
                  articles={articles}
                  getArticles={getArticles}
                  deleteArticle={deleteArticle}
                  setCurrentArticle={setCurrentArticle}
                  currentArticle={currentArticle}
                />
              </>
            }
          />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  );
}