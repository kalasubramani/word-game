import { useState } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState([]);
  const [checkWords, setCheckWords] = useState(false);
  const [selectedOption,setSelectedOption] = useState("anagrams");

  const onTextChange = (e) => {
    setInput(e.target.value);
  };

  const getAnagrams = () => {
    let anagrams = allAnagrams(input);
    checkWords
      ? checkValidWord(anagrams).then((result) => setOutput(result))
      : setOutput(anagrams);
  };

  const getSubstrings = () => {
    let substrings = allSubstring(input);
    checkWords
      ? checkValidWord(substrings).then((result) => setOutput(result))
      : setOutput(substrings);
  };

  const renderOutput = output.map((val) => {
    return (
      <li key={val} style={{ listStyleType: "none" }}>
        {val}
      </li>
    );
  });

  const checkValidWord = async (words) => {
    let validWords = [];

    const results = words.map(async (word) => {
      //call api
      let isValid = await isValidDictionaryWord(word);
      if (isValid) validWords.push(word);
    });
    await Promise.all(results);
    return validWords;
  };

  async function isValidDictionaryWord(word) {
    const result = await fetch(`/api/validate-word/${word}`);
   
    if (!result.ok) return false;
    else {
      console.log(result);
      return true;
    }
  }
  function allAnagrams(str) {
    //define a set to hold results - elimates duplicates at insertion
    //iterate thru chars in string
    //get char at 1 + letters before i + letter after i
    //push all combinations of anagrams to anagramSet

    //if end of string is reached, rotate the string to right by 1
    //incr rotation by 1

    //if rotations >= string length
    //break
    //else continue

    //return anagramSet

    let anagramSet = new Set(),
      rotate = 0,
      length = str.length;

    while (rotate < length) {
      getAllAnagrams(str, anagramSet, length);
      //rotate string to right by 1
      let roateright = str.slice(1).concat(str.slice(0, 1));
      str = roateright;
      rotate++;
    }

    return [...anagramSet];
  }

  function run(){
    if(input){
      if(selectedOption==="substrings") getSubstrings();
      else getAnagrams();
    }   
  }
  function getAllAnagrams(str, anagramSet, n) {
    for (let i = 0; i < n; i++) {
      //get char at i + letters before i + letter after i
      anagramSet.add(
        str
          .slice(i, i + 1)
          .concat(str.slice(0, i))
          .concat(str.slice(i + 1))
      );
    }
  }

  function allSubstring(str) {
    //if str len is 0, return
    //if str len is 1, return

    //function - findAllSubstrings(str)
    //params - str, setObj, length
    //returns all substrings for a given string
    //input string is sliced to get substrings
    //if substr length >1, add to the set
    //return set

    //rotate input string n-1 times
    //pass rotated string to  findAllSubstrings()
    //get all substrings in a set to eliminate duplicates
    //pass reversed str too findAllSubstrings()
    //new substrings are added to the set

    //return set

    const n = str.length;
    if (n === 0) return;
    if (n === 1) return;

    let substrings = new Set(),
      rotate = 0,
      temp;

    while (rotate < n) {
      getAllSubstrings(str, substrings, n);

      let rev = str.split("").reverse().join("");
      getAllSubstrings(rev, substrings, n);

      //rotate string to right by 1
      let roateright = str.slice(1).concat(str.slice(0, 1));
      str = roateright;
      rotate++;
    }

    return [...substrings];
  }

  function getAllSubstrings(str, substrings, n) {
    for (let i = 0; i < n; i++) {
      for (let j = 1; j <= n; j++) {
        let substr = str.slice(i, j);
        if (substr.length > 1) substrings.add(substr);
      }
    }
    return substrings;
  }

  return (
    <>     
      <h2>Word Game</h2>
      <form onSubmit={(e)=>{e.preventDefault()}}>
        <div className="card">
          <label>          
            Enter your text:{" "}
            <input id="input" value={input} onChange={onTextChange} required></input>
          </label>
          <div style={{ display: "flex", flexDirection: "row",height:"50px",paddingTop:"20px" }}>
            <div style={{ width: "200px" }}>
              <input
                type="radio"
                id="anagrams"
                value="anagrams"
                name="constraints"
                checked={selectedOption==="anagrams"}
                onChange={()=>{setSelectedOption("anagrams")}}
              />
              Anagrams
            </div>
            <div style={{ width: "200px" }}>
              {" "}
              <input
                type="radio"
                id="substrings"
                value="substrings"
                name="constraints"
                checked={selectedOption==="substrings"}
                onChange={()=>{setSelectedOption("substrings")}}
              />
              Substrings
            </div>
            
            <div style={{ width: "200px" }}>
              {" "}
              <input
                type="checkbox"
                checked={checkWords}
                id="dictWord"
                value="dictWord"
                name=""
                onChange={() => {
                  setCheckWords(!checkWords);
                }}
              />
              Valid Dictionary Words
            </div>
          </div>
          <button onClick={run} >
            Run
          </button>
          <ul id="output">{renderOutput}</ul>
        </div>
      </form>
    </>
  );
}

export default App;
