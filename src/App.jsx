import { useCallback, useEffect, useState } from 'react'
import { useDescope, useSession, useUser } from '@descope/react-sdk'
import { Descope } from '@descope/react-sdk'
import { getSessionToken } from '@descope/react-sdk';

const App = () => {
  const { isAuthenticated, isSessionLoading } = useSession()
  const { isUserLoading } = useUser()

  return <div style={{
    margin: "5vw",
    width: "90vw",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
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

    {!isUserLoading && isAuthenticated && (<LoggedIn />)}
  </div>;
}

const LoggedIn = () => {

  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState([])
  const [error, setError] = useState(null)

  const { logout } = useDescope()
  const { user } = useUser()

  const handleLogout = useCallback(() => {
    logout()
  }, [logout])

  const fetchQuestions = async () => {
    const sessionToken = getSessionToken();

    try {
      const response = await fetch('http://localhost:3000/get-questions', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.questions || !data.answers) {
        throw new Error('Questions or answers are undefined or null');
      }

      setQuestions(data.questions);
      setAnswers(data.answers);
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to fetch questions or answers');
    }
  }



  useEffect(() => {
    fetchQuestions()
  }, [])



  const getRoleMessage = () => {
    return (user.roleNames && user.roleNames.length > 0)
      ? "For " + user.roleNames[0].toLowerCase() + "s"
      : "No roles assigned";
  }

  return <>
    <h1>Unit Test</h1>
    <p>
      {getRoleMessage()}
      <br />
      {"Logged in user: " + user.email}
    </p>
    {error && <p>{error}</p>}
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