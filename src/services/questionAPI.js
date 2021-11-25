const fetchQuestionAPI = async () => {
  const token = localStorage.getItem('token');
  console.log(token);
  try {
    const response = await fetch(`https://opentdb.com/api.php?amount=5&token=${token}`);
    const json = await response.json();
    const { results } = json;
    console.log(results);
    return json;
  } catch (err) {
    console.error(err);
  }
};

export default fetchQuestionAPI;
