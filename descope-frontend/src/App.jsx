import { useCallback, useEffect, useState } from 'react'

import { useDescope, useSession, useUser } from '@descope/react-sdk'
import { Descope } from '@descope/react-sdk'
import { getSessionToken } from '@descope/react-sdk';

const App = () => {
  const { isAuthenticated, isSessionLoading } = useSession()
  const { isUserLoading } = useUser()

  return <><div style={{
    margin: "5vw",
    width: "90vw",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  }}>
    {!isAuthenticated && (
      <Descope
        flowId="sign-up-or-in"
        onSuccess={() => console.log('Logged in!')}
        onError={() => console.log('Could not log in!')}
      />
    )}

    {(isSessionLoading || isUserLoading) && <p>Loading...</p>}

  </div>
  <div style={{
    margin: "5vw",
    width: "90vw",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
  }}>
  {!isUserLoading && isAuthenticated && (<LoggedIn />)}
  </div>
  </>;
}

const LoggedIn = () => {

  const { logout } = useDescope()
  const { user } = useUser()

  const handleLogout = useCallback(() => {
    logout()
  }, [logout])


  const fetchQuestions = async () => {
    const sessionToken = getSessionToken();

    // example fetch call with authentication header
    fetch('http://localhost:3000/get-questions', {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + sessionToken,
      }
    })
      .then(r => r.json())
      .then(r => {
        setQuestions(r.questions)
        setAnswers(r.answers)
      })
  }

  useEffect(() => {
    fetchQuestions()
  }, [])

  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState([])

  return <>
    <h1>Unit Test</h1>
    <p>
      {"For " + user.roleNames[0].toLowerCase() + "s"}
      <br />
      {"Logged in user: " + user.email}
    </p>
    {questions.map((elem, index) => {
      return <Question questionString={elem} answerString={answers && answers.length !== 0 ? answers[index] : ""} key={index} serialNumber={index + 1} />
    })}
    <button onClick={handleLogout}>Logout</button>
  </>
}

const Question = (props) => {
  return <div>
    <h2>{props.serialNumber + ". " + props.questionString}</h2>
    <p>{props.answerString}</p>
  </div>
}

export default App;
