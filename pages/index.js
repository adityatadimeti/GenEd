import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [story, setStory] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: animalInput }),
      });

      const data = await response.json();
      console.log(data);
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setStory(data.result);
      setAnimalInput("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  function removeFlashcard(index) {
    const lines = story.split("\n");
    lines.splice(index, 1);
    setStory(lines.join("\n"));
  }

  function downloadCsv() {
    const csvContent = "data:text/csv;charset=utf-8," + story.replaceAll("\n", ",");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "flashcards.csv");
    document.body.appendChild(link);
    link.click();
  }

  return (
    <div>
      <Head>
        <title>GenEd</title>

      </Head>

      <main className={styles.main}>

        <h3>Create flashcards from an input</h3>
        <form onSubmit={onSubmit}>
          <textarea
            type="text"
            name="animal"
            wrap="soft"
            placeholder="Enter your input"
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
          />
          <input type="submit" value="Generate flashcards" />
        </form>
        <div className={styles.result}>
          {story.length > 0 ? (
            <>
              <button onClick={downloadCsv}>Download CSV</button>
              <h4>Generated flashcards</h4>
              {story.split("\n").map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
}
