import { useState } from "react";

const ALL_WORDS = [
  { term:"(One) had better", definition:"Used to express that something would be a good idea", example:"You had better bring a jacket, it's cold outside", episode:"S1E1" },
  { term:"Buzzer", definition:"The button that opens the door to an apartment building", example:"Could you press the buzzer and let him in?", episode:"S1E1" },
  { term:"Catch on", definition:"To become aware of something", example:"I should have caught on that he was drunk because he could barely walk", episode:"S1E1" },
  { term:"Crash on (sb's) couch", definition:"To sleep at someone's house on their couch", example:"Max is crashing on our couch until he can find a new apartment", episode:"S1E1" },
  { term:"Drift apart", definition:"To become more distant in a relationship", example:"They got a divorce after drifting apart during their five years of marriage", episode:"S1E1" },
  { term:"Get screwed", definition:"To get tricked; to get a bad deal", example:"He got screwed on the price of his new car", episode:"S1E1" },
  { term:"Honeymoon", definition:"The trip you take after getting married", example:"They spent their honeymoon in Aruba", episode:"S1E1" },
  { term:"Mess", definition:"An extremely unorganized state", example:"The kitchen is a mess, clean it up", episode:"S1E1" },
  { term:"Over and over", definition:"Repeatedly", example:"He kept playing the song over and over", episode:"S1E1" },
  { term:"Split (sth)", definition:"To share something", example:"Want to split the last cookie?", episode:"S1E1" },
  { term:"Walk out on (sb)", definition:"To abandon someone", example:"He walked out on his wife two months ago", episode:"S1E1" },
  { term:"Geek", definition:"Someone with very specific, sometimes nerdy interests", example:"Many geeks are obsessed with Star Trek", episode:"S1E1" },
  { term:"All of a sudden", definition:"Used when something unexpected happens", example:"All of a sudden it started raining", episode:"S1E1" },
  { term:"Hit on (sb)", definition:"To openly express romantic interest in someone", example:"Please don't hit on my sister", episode:"S1E1" },
  { term:"Are you kidding", definition:"An expression of disbelief", example:"Messi is injured, are you kidding?", episode:"S1E1" },
  { term:"Come on!", definition:"Expression of disbelief or used to convince someone", example:"Come on! You're going out with the guy, there must be something wrong with him", episode:"S1E1" },
  { term:"Have a crush on (sb)", definition:"To have romantic feelings towards someone", example:"I had a crush on you in High School", episode:"S1E1" },
  { term:"Ask (sb) out", definition:"To ask someone to go on a date with you", example:"If you like her, you should ask her out", episode:"S1E1" },
  { term:"Turn out", definition:"To result in a certain way", example:"It turns out she's not pregnant", episode:"S1E1" },
  { term:"Freak out", definition:"To panic or be overcome with anxiety", example:"She freaks out every time she sees a spider", episode:"S1E1" },
  { term:"Hang out", definition:"To spend time with someone or in a place", example:"Want to go hang out at the mall?", episode:"S1E1" },
  { term:"After all", definition:"Despite expectations", example:"I guess I didn't need my umbrella, after all.", episode:"S1E2" },
  { term:"Be a thing", definition:"To be a romantic couple", example:"Did you know they are a thing?", episode:"S1E2" },
  { term:"Bring (sth) up", definition:"To mention something in conversation", example:"Were you planning on bringing up the big news?", episode:"S1E2" },
  { term:"Chances are", definition:"Likely", example:"Chances are it will rain all weekend", episode:"S1E2" },
  { term:"Dread (sth)", definition:"To anticipate something with fear or anxiety", example:"I'm dreading my English exam; I haven't studied anything", episode:"S1E2" },
  { term:"Driven", definition:"Strongly motivated to succeed", example:"We hired him because he's extremely driven", episode:"S1E2" },
  { term:"Have a thing for (sb)", definition:"To be attracted to someone", example:"I had a thing for her until I found out she was mean", episode:"S1E2" },
  { term:"Roll with the Punches", definition:"To adapt to a difficult situation, go with the flow", example:"She got fired but decided to roll with the punches", episode:"S1E2" },
  { term:"Shoot for the stars", definition:"To aim for big goals in life", example:"Believe in yourself and you can shoot for the stars", episode:"S1E2" },
  { term:"Wind up", definition:"To end up, to result in a certain way", example:"The game was cancelled so we wound up watching a movie instead", episode:"S1E2" },
  { term:"Dump", definition:"To break up with someone", example:"He dumped her after six months of dating", episode:"S1E2" },
];

const EPISODES = [...new Set(ALL_WORDS.map(w => w.episode))];

export default function App() {
  const [selected, setSelected] = useState(null);

  const words = selected ? ALL_WORDS.filter(w => w.episode === selected) : [];

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <h1>Vocabify</h1>
      <p>English vocabulary from Friends</p>

      <h2>Episodes</h2>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {EPISODES.map(ep => (
          <button
            key={ep}
            onClick={() => setSelected(ep)}
            style={{ padding: '6px 14px', background: selected === ep ? '#333' : '#eee', color: selected === ep ? '#fff' : '#333', border: 'none', borderRadius: 6, cursor: 'pointer' }}
          >
            {ep}
          </button>
        ))}
      </div>

      {selected && (
        <div>
          <h2>{selected} — {words.length} words</h2>
          {words.map(w => (
            <div key={w.term} style={{ borderBottom: '1px solid #eee', padding: '12px 0' }}>
              <strong>{w.term}</strong>
              <p style={{ margin: '4px 0', color: '#555' }}>{w.definition}</p>
              <p style={{ margin: 0, fontStyle: 'italic', color: '#888' }}>"{w.example}"</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
