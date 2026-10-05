import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// fibAnswer = the word that actually appears in the example sentence (for fill-in-blank)
const ALL_WORDS = [
  { term:"(One) had better", fibAnswer:"had better", definition:"Used to express that something would be a good idea", example:"You had better bring a jacket, it's cold outside", episode:"S1E1" },
  { term:"Buzzer", fibAnswer:"buzzer", definition:"The button that opens the door to an apartment building", example:"Could you press the buzzer and let him in?", episode:"S1E1" },
  { term:"Catch on", fibAnswer:"caught on", definition:"To become aware of something", example:"I should have caught on that he was drunk because he could barely walk", episode:"S1E1" },
  { term:"Crash on (sb's) couch", fibAnswer:"crashing", definition:"To sleep at someone's house on their couch", example:"Max is crashing on our couch until he can find a new apartment", episode:"S1E1" },
  { term:"Drift apart", fibAnswer:"drifting apart", definition:"To become more distant in a relationship", example:"They got a divorce after drifting apart during their five years of marriage", episode:"S1E1" },
  { term:"Get screwed", fibAnswer:"screwed", definition:"To get tricked; to get a bad deal", example:"He got screwed on the price of his new car", episode:"S1E1" },
  { term:"Honeymoon", fibAnswer:"honeymoon", definition:"The trip you take after getting married", example:"They spent their honeymoon in Aruba", episode:"S1E1" },
  { term:"Mess", fibAnswer:"mess", definition:"An extremely unorganized state", example:"The kitchen is a mess, clean it up", episode:"S1E1" },
  { term:"Over and over", fibAnswer:"over", definition:"Repeatedly", example:"He kept playing the song over and over", episode:"S1E1" },
  { term:"Split (sth)", fibAnswer:"split", definition:"To share something", example:"Want to split the last cookie?", episode:"S1E1" },
  { term:"Walk out on (sb)", fibAnswer:"walked out on", definition:"To abandon someone", example:"He walked out on his wife two months ago", episode:"S1E1" },
  { term:"Geek", fibAnswer:"geeks", definition:"Someone with very specific, sometimes nerdy interests", example:"Many geeks are obsessed with Star Trek", episode:"S1E1" },
  { term:"All of a sudden", fibAnswer:"all of a sudden", definition:"Used when something unexpected happens", example:"All of a sudden it started raining", episode:"S1E1" },
  { term:"Hit on (sb)", fibAnswer:"hit on", definition:"To openly express romantic interest in someone", example:"Please don't hit on my sister", episode:"S1E1" },
  { term:"Are you kidding", fibAnswer:"are you kidding", definition:"An expression of disbelief", example:"Messi is injured, are you kidding?", episode:"S1E1" },
  { term:"Come on!", fibAnswer:"come on", definition:"Expression of disbelief or used to convince someone", example:"Come on! You're going out with the guy, there must be something wrong with him", episode:"S1E1" },
  { term:"Have a crush on (sb)", fibAnswer:"crush", definition:"To have romantic feelings towards someone", example:"I had a crush on you in High School", episode:"S1E1" },
  { term:"Ask (sb) out", fibAnswer:"ask her out", definition:"To ask someone to go on a date with you", example:"If you like her, you should ask her out", episode:"S1E1" },
  { term:"Turn out", fibAnswer:"turns out", definition:"To result in a certain way", example:"It turns out she's not pregnant", episode:"S1E1" },
  { term:"Freak out", fibAnswer:"freaks out", definition:"To panic or be overcome with anxiety", example:"She freaks out every time she sees a spider", episode:"S1E1" },
  { term:"Hang out", fibAnswer:"hang out", definition:"To spend time with someone or in a place", example:"Want to go hang out at the mall?", episode:"S1E1" },
  { term:"After all", fibAnswer:"after all", definition:"Despite expectations", example:"I guess I didn't need my umbrella, after all.", episode:"S1E2" },
  { term:"Be a thing", fibAnswer:"a thing", definition:"To be a romantic couple", example:"Did you know they are a thing?", episode:"S1E2" },
  { term:"Bring (sth) up", fibAnswer:"bringing up", definition:"To mention something in conversation", example:"Were you planning on bringing up the big news?", episode:"S1E2" },
  { term:"Chances are", fibAnswer:"chances are", definition:"Likely", example:"Chances are it will rain all weekend", episode:"S1E2" },
  { term:"Dread (sth)", fibAnswer:"dreading", definition:"To anticipate something with fear or anxiety", example:"I'm dreading my English exam; I haven't studied anything", episode:"S1E2" },
  { term:"Driven", fibAnswer:"driven", definition:"Strongly motivated to succeed", example:"We hired him because he's extremely driven", episode:"S1E2" },
  { term:"Have a thing for (sb)", fibAnswer:"a thing for", definition:"To be attracted to someone", example:"I had a thing for her until I found out she was mean", episode:"S1E2" },
  { term:"Roll with the Punches", fibAnswer:"roll with the punches", definition:"To adapt to a difficult situation, go with the flow", example:"She got fired but decided to roll with the punches", episode:"S1E2" },
  { term:"Shoot for the stars", fibAnswer:"shoot for the stars", definition:"To aim for big goals in life", example:"Believe in yourself and you can shoot for the stars", episode:"S1E2" },
  { term:"Wind up", fibAnswer:"wound up", definition:"To end up, to result in a certain way", example:"The game was cancelled so we wound up watching a movie instead", episode:"S1E2" },
  { term:"Dump", fibAnswer:"dumped", definition:"To break up with someone", example:"He dumped her after six months of dating", episode:"S1E2" },
  { term:"Adore", fibAnswer:"adore", definition:"A stronger way to say love", example:"I adore lentil stew", episode:"S1E3" },
  { term:"Be even (with sb)", fibAnswer:"even", definition:"Not owing anything to someone", example:"Here are the 5 bucks I owed you, now we're even.", episode:"S1E3" },
  { term:"Bicker", fibAnswer:"bickering", definition:"To have a small, unimportant argument", example:"They were bickering about the color of the new curtains", episode:"S1E3" },
  { term:"Endearing", fibAnswer:"endearing", definition:"Inspiring affection", example:"His smile is endearing", episode:"S1E3" },
  { term:"Flaw", fibAnswer:"flaws", definition:"A defect or imperfection", example:"She has many flaws, but she's the kindest person I know", episode:"S1E3" },
  { term:"I've had it (with sth)", fibAnswer:"had it", definition:"To be sick of something, completely fed up", example:"I've had it with studying boring grammar textbooks!", episode:"S1E3" },
  { term:"The bottom line is...", fibAnswer:"bottom line", definition:"In summary; the main point is", example:"The bottom line is, I can't handle my job anymore", episode:"S1E3" },
  { term:"Big deal", fibAnswer:"big deal", definition:"A big problem or important matter (also used sarcastically)", example:"I can take you to the airport, it's not a big deal", episode:"S1E3" },
  { term:"Let it go", fibAnswer:"let it go", definition:"Forget about something negative", example:"Are you still upset about that? Let it go!", episode:"S1E3" },
  { term:"Freak", fibAnswer:"freak", definition:"Someone who looks or behaves very strangely", example:"He's never had chocolate? What a freak!", episode:"S1E4" },
  { term:"Have a good time", fibAnswer:"good time", definition:"To enjoy oneself", example:"Did you have a good time at the party?", episode:"S1E4" },
  { term:"Never mind", fibAnswer:"never mind", definition:"Forget about it, don't worry about it", example:"Can you grab me a spoon? Never mind, I'll get it.", episode:"S1E4" },
  { term:"Nuts", fibAnswer:"nuts", definition:"Crazy", example:"She's nuts about chocolate fondue", episode:"S1E4" },
  { term:"Predicament", fibAnswer:"predicament", definition:"A difficult or unpleasant situation", example:"He's in a predicament: he wants to start a business but has no money", episode:"S1E4" },
  { term:"Take (one's) mind off (sth)", fibAnswer:"take your mind off", definition:"To distract someone from something", example:"A funny movie will take your mind off the break up", episode:"S1E4" },
  { term:"Be beyond (sb)", fibAnswer:"beyond me", definition:"To be outside of one's capacity to understand", example:"Why you hired him is beyond me", episode:"S1E5" },
  { term:"Blow (one's) mind", fibAnswer:"blows my mind", definition:"To surprise immensely", example:"It blows my mind how hot it is today", episode:"S1E5" },
  { term:"Gang up on (sb)", fibAnswer:"ganged up on", definition:"To act in a group against somebody", example:"They all ganged up on him in the meeting", episode:"S1E5" },
  { term:"Go out with sb", fibAnswer:"going out", definition:"To date somebody", example:"They've been going out for about a year", episode:"S1E5" },
  { term:"Here's the thing", fibAnswer:"here's the thing", definition:"Used to prepare the listener for what you're about to say", example:"Here's the thing, I'm a vegetarian, so I better not go to the barbeque", episode:"S1E5" },
  { term:"Make it", fibAnswer:"made it", definition:"To achieve something difficult", example:"They made it to the final game, but lost", episode:"S1E5" },
  { term:"Snuggle", fibAnswer:"snuggled", definition:"To cuddle in a comfortable position", example:"We just snuggled on the couch and watched a movie", episode:"S1E5" },
  { term:"Break up with (sb)", fibAnswer:"broke up", definition:"To end a relationship with somebody", example:"We broke up after 3 years of dating", episode:"S1E5" },
  { term:"Awful", fibAnswer:"awful", definition:"Terrible, very bad", example:"I had an awful day and on top of that it's raining", episode:"S1E6" },
  { term:"Change (one's) mind", fibAnswer:"change my mind", definition:"To change one's opinion about something", example:"That documentary made me change my mind about vegetarianism", episode:"S1E6" },
  { term:"Crappy", fibAnswer:"crappy", definition:"Of bad quality", example:"What a crappy movie", episode:"S1E6" },
  { term:"For the hell of it", fibAnswer:"for the hell of it", definition:"For no particular reason, just for fun", example:"We're going to go to the beach just for the hell of it", episode:"S1E6" },
  { term:"It's worth it", fibAnswer:"worth it", definition:"The effort or cost is justified by the benefit", example:"Going to Machu Picchu is expensive, but it's totally worth it!", episode:"S1E6" },
  { term:"Opening Line", fibAnswer:"opening line", definition:"First comment used to start a conversation with someone", example:"That is the worst opening line I've ever heard", episode:"S1E6" },
  { term:"Out of (sb's) league", fibAnswer:"out of my league", definition:"Said of someone who is too attractive or successful for you to date", example:"It's not worth trying, she's out of my league", episode:"S1E6" },
  { term:"Resent", fibAnswer:"resents", definition:"To feel anger and displeasure toward someone", example:"Ross resents Pablo for stealing Rachel", episode:"S1E6" },
  { term:"Break down", fibAnswer:"broke down", definition:"To stop working properly", example:"My car broke down last week", episode:"S1E7" },
  { term:"Eligible", fibAnswer:"eligible", definition:"Suitable as a romantic partner", example:"He's a very eligible bachelor", episode:"S1E7" },
  { term:"Friend Zone", fibAnswer:"friend zone", definition:"The situation where you like someone romantically but they just see you as a friend", example:"You didn't make a move and now you're stuck in the friend zone", episode:"S1E7" },
  { term:"Loathe", fibAnswer:"loathe", definition:"To deeply hate something or someone", example:"I loathe politics", episode:"S1E7" },
  { term:"Make a move", fibAnswer:"make a move", definition:"To take advantage of an opportunity, usually romantically", example:"You better make a move before someone else does", episode:"S1E7" },
  { term:"On top of the world", fibAnswer:"on top of the world", definition:"Extremely happy", example:"She was on top of the world after her promotion", episode:"S1E7" },
  { term:"Overrated", fibAnswer:"overrated", definition:"Considered to be better than it actually is", example:"That restaurant is totally overrated", episode:"S1E7" },
  { term:"Scared to death", fibAnswer:"scared to death", definition:"Extremely scared", example:"I'm scared to death of heights", episode:"S1E7" },
  { term:"Hold Up", fibAnswer:"held up", definition:"To make someone wait; to delay someone", example:"I got held up at the supermarket today", episode:"S1E8" },
  { term:"Look into (sth)", fibAnswer:"look into", definition:"To investigate something", example:"I'm going to look into spending Christmas in the Caribbean", episode:"S1E8" },
  { term:"Pass out", fibAnswer:"passes out", definition:"To faint", example:"She passes out every time she sees blood", episode:"S1E8" },
  { term:"Pick on (sb)", fibAnswer:"pick on", definition:"To treat someone unfairly, to bully", example:"Don't pick on your little brother!", episode:"S1E8" },
  { term:"Show (sth) off", fibAnswer:"showing off", definition:"To brag or boast about something", example:"He keeps showing off his new car", episode:"S1E8" },
  { term:"Vibe", fibAnswer:"vibe", definition:"An intangible energy or feeling you can perceive from a person or place", example:"Her new boyfriend gives me a good vibe", episode:"S1E8" },
  { term:"Get along", fibAnswer:"get along", definition:"To have a good relationship with someone", example:"I used to fight with my brother, but now we get along fine.", episode:"S1E8" },
  { term:"Be behind (sth)", fibAnswer:"behind", definition:"To support something", example:"I'm completely behind your decision to move to Spain", episode:"S1E9" },
  { term:"Bust (one's) ass", fibAnswer:"busting my ass", definition:"To work really hard on something", example:"I've been busting my ass making dinner for you", episode:"S1E9" },
  { term:"Infectious", fibAnswer:"infectious", definition:"Contagious, able to be spread (like laughter)", example:"She has the most infectious laugh I've ever heard", episode:"S1E9" },
  { term:"Mope", fibAnswer:"moping", definition:"To whine, complain, and be depressed", example:"Stop moping and do something about it!", episode:"S1E9" },
  { term:"Ruin", fibAnswer:"ruined", definition:"To destroy, to make something unusable", example:"He spilled some paint and ruined the picture", episode:"S1E9" },
  { term:"Smirk", fibAnswer:"smirking", definition:"A sly, knowing smile", example:"Why are you smirking at me?", episode:"S1E9" },
  { term:"Catch up (with sb)", fibAnswer:"catch up", definition:"To inform someone of the latest news in your life", example:"Let's catch up over coffee next week, are you free?", episode:"S1E10" },
  { term:"Drag one's feet", fibAnswer:"dragging your feet", definition:"To do something slowly and lazily", example:"Stop dragging your feet and go make your dreams happen", episode:"S1E10" },
  { term:"Have a blast", fibAnswer:"blast", definition:"Have a really good time", example:"They had a blast at the festival", episode:"S1E10" },
  { term:"Juggle", fibAnswer:"juggling", definition:"To try to do many things at the same time", example:"I've been juggling so many things at work", episode:"S1E10" },
  { term:"Mingle", fibAnswer:"mingle", definition:"To interact socially with other people", example:"I'd rather watch a movie than mingle with strangers at a party", episode:"S1E10" },
  { term:"Pact", fibAnswer:"pact", definition:"An agreement between people", example:"We made a pact to study English every day", episode:"S1E10" },
  { term:"Show up", fibAnswer:"show up", definition:"To arrive somewhere", example:"You can't show up drunk at work", episode:"S1E10" },
  { term:"Snap", fibAnswer:"snapped", definition:"To suddenly lose control in an eruption of emotion", example:"After years of working with a horrible boss, she finally snapped", episode:"S1E10" },
  { term:"You wish!", fibAnswer:"you wish", definition:"Used to say what someone said is not true or will never happen", example:"'Jennifer will go out with me.' 'You wish!'", episode:"S1E10" },
  { term:"Make out", fibAnswer:"made out", definition:"To kiss passionately", example:"The teenagers made out on the couch", episode:"S1E10" },
  { term:"Beam with pride", fibAnswer:"beaming with pride", definition:"To have an obvious look of pride on your face", example:"She was beaming with pride as she accepted the award", episode:"S1E11" },
  { term:"Break sb's heart", fibAnswer:"broke his heart", definition:"To overwhelm someone with sadness", example:"She completely broke his heart when she asked for a divorce", episode:"S1E11" },
  { term:"Come out of (one's) shell", fibAnswer:"come out of his shell", definition:"To start being more comfortable in social situations", example:"He will come out of his shell when he gets to know you better", episode:"S1E11" },
  { term:"Crave", fibAnswer:"craving", definition:"To have a specific strong desire for something", example:"I'm craving a cigarette, but I'm trying to quit", episode:"S1E11" },
  { term:"Euphemism", fibAnswer:"euphemism", definition:"A polite word used in place of something unpleasant or rude", example:"'Pass away' is a euphemism for 'die'", episode:"S1E11" },
  { term:"Famished", fibAnswer:"famished", definition:"Starving, very hungry", example:"I was famished after running the marathon", episode:"S1E11" },
  { term:"Knockout", fibAnswer:"knockout", definition:"An extremely attractive person", example:"His sister is a knockout", episode:"S1E11" },
  { term:"Mean it", fibAnswer:"mean it", definition:"Used to show that what you're saying is very genuine", example:"I mean it, you're a really amazing cook", episode:"S1E11" },
  { term:"Give something a shot", fibAnswer:"give it a shot", definition:"To try something or attempt to do something", example:"I've never played basketball before, but I'll give it a shot", episode:"S1E11" },
  { term:"Stop by", fibAnswer:"stop by", definition:"To visit someone briefly", example:"Do you want to stop by the house and grab your things?", episode:"S1E11" },
  { term:"Good-looking", fibAnswer:"good looking", definition:"Attractive", example:"Angelina Jolie is really good looking", episode:"S1E11" },
  { term:"Woozy", fibAnswer:"woozy", definition:"Dizzy or slightly faint", example:"He felt woozy from eating so much at the party", episode:"S1E11" },
  { term:"Charming", fibAnswer:"charming", definition:"Pleasant, attractive, smooth-talking", example:"He's a regular prince charming", episode:"S1E12" },
  { term:"Distraught", fibAnswer:"distraught", definition:"Really upset or distressed", example:"She's going to be distraught when you break up with her", episode:"S1E12" },
  { term:"Fling", fibAnswer:"fling", definition:"A short, intense romantic relationship", example:"They had a fling last summer but it didn't last long", episode:"S1E12" },
  { term:"Heads up", fibAnswer:"heads up", definition:"A warning or advance notice about something", example:"Just a heads up, it might rain so take your umbrella", episode:"S1E12" },
  { term:"Nauseous", fibAnswer:"nauseous", definition:"Feeling sick, wanting to vomit", example:"I feel nauseous every time I smell hot dogs", episode:"S1E12" },
  { term:"Overwhelm", fibAnswer:"overwhelmed", definition:"To have a feeling of too much to deal with", example:"I'm overwhelmed with my job and my studies", episode:"S1E12" },
  { term:"Things get ugly", fibAnswer:"things got ugly", definition:"Said when a situation gets bad or chaotic", example:"When she caught him cheating things got ugly.", episode:"S1E12" },
  { term:"Wuss", fibAnswer:"wuss", definition:"An insult saying someone is weak or cowardly", example:"Don't be a wuss, rollercoasters aren't that scary", episode:"S1E12" },
  { term:"Back up (there)", fibAnswer:"back up", definition:"Say that again, rewind what you just said", example:"Back up there, what did he tell you?", episode:"S1E13" },
  { term:"Between a Rock and a Hard Place", fibAnswer:"between a rock and a hard place", definition:"In a very difficult situation with no easy way out", example:"I was between a rock and a hard place when she asked me to choose", episode:"S1E13" },
  { term:"Come clean", fibAnswer:"came clean", definition:"To confess something", example:"The politician finally came clean about stealing all that money", episode:"S1E13" },
  { term:"Go the distance", fibAnswer:"went the distance", definition:"To make a long-term commitment", example:"He really went the distance, being married for over 50 years", episode:"S1E13" },
  { term:"Keep an eye on (sth/sb)", fibAnswer:"keep an eye on", definition:"To watch something or someone cautiously", example:"Could you keep an eye on this sauce and make sure it doesn't burn?", episode:"S1E13" },
  { term:"Low self-esteem", fibAnswer:"low self-esteem", definition:"A lack of confidence; not valuing yourself much", example:"She had low self-esteem in high school, but now she's very confident", episode:"S1E13" },
  { term:"Sabotage", fibAnswer:"sabotage", definition:"To deliberately destroy or damage something to prevent success", example:"He tried to sabotage her project so he could win the competition", episode:"S1E13" },
  { term:"Stand-up guy", fibAnswer:"stand-up guy", definition:"Someone with strong values and good character", example:"Everyone agrees he's a really stand-up guy", episode:"S1E13" },
  { term:"Creepy", fibAnswer:"creepy", definition:"Causing an unpleasant feeling of fear or unease", example:"He's always staring at us, it's really creepy", episode:"S1E13" },
  { term:"For God's sake", fibAnswer:"for god's sake", definition:"Exclamation expressing surprise, anger, or impatience", example:"For God's sake, why would you put spicy sauce on pancakes?", episode:"S1E13" },
  { term:"Barely", fibAnswer:"barely", definition:"Hardly, almost not at all", example:"He could barely see what was happening", episode:"S1E14" },
  { term:"Don't you dare", fibAnswer:"don't you dare", definition:"Used to threaten or warn someone not to do something", example:"Don't you dare drink the last beer", episode:"S1E14" },
  { term:"Get back in the game", fibAnswer:"get back in the game", definition:"To return to action, especially in dating", example:"You broke up 6 months ago, it's time to get back in the game", episode:"S1E14" },
  { term:"Jet lag", fibAnswer:"jet lag", definition:"Fatigue caused by traveling across multiple time zones", example:"Jet lag is really bad when you fly to Australia", episode:"S1E14" },
  { term:"Set (sb) up (with sb)", fibAnswer:"set up", definition:"To arrange a date between two people", example:"I set up my two best friends, but it didn't work out", episode:"S1E14" },
  { term:"Take (sb) out", fibAnswer:"take you out", definition:"To go out on a date with someone", example:"Could I take you out for dinner sometime?", episode:"S1E14" },
  { term:"Throw up", fibAnswer:"throwing up", definition:"To vomit", example:"He got the flu and couldn't stop throwing up", episode:"S1E14" },
  { term:"Way to go!", fibAnswer:"way to go", definition:"Good job, well done", example:"You scored three goals, way to go!", episode:"S1E14" },
  { term:"Bail on (sb)", fibAnswer:"bailed on", definition:"To ditch someone, to cancel plans last minute", example:"I can't believe you bailed on me and I had to watch the movie alone", episode:"S1E14" },
  { term:"Screw up", fibAnswer:"screwed up", definition:"To fail at something or make a bad mistake", example:"We screwed up on the English exam and didn't pass", episode:"S1E14" },
  { term:"Needy", fibAnswer:"needy", definition:"Overly in need of love and attention", example:"He can't get a date because he's too needy and clingy", episode:"S1E14" },
  { term:"Brag", fibAnswer:"bragging", definition:"To talk in a boastful manner about yourself", example:"Stop bragging about winning", episode:"S1E15" },
  { term:"Catch a movie", fibAnswer:"catch a movie", definition:"To see a movie, especially at the theater", example:"You want to grab dinner then catch a movie?", episode:"S1E15" },
  { term:"Flattering", fibAnswer:"flattering", definition:"Nice-looking; making someone look their best", example:"That's a very flattering dress, where did you buy it?", episode:"S1E15" },
  { term:"Prank", fibAnswer:"prank", definition:"A practical joke or mischievous act played on someone", example:"They pulled a prank on their teacher", episode:"S1E15" },
  { term:"Root for (sth/sb)", fibAnswer:"rooting for", definition:"To cheer for or support someone", example:"They were rooting for Spain to win the world cup", episode:"S1E15" },
  { term:"Seal the deal", fibAnswer:"sealed the deal", definition:"To make something official or final", example:"We went back to my place and then I sealed the deal", episode:"S1E15" },
  { term:"Admit (sth)", fibAnswer:"admitted", definition:"To confess that something is true", example:"He admitted he stole her chocolate", episode:"S1E15" },
  { term:"Figure out (sth)", fibAnswer:"figured out", definition:"To work out a solution to something", example:"He figured out that the best way to get there was by train", episode:"S1E15" },
  { term:"Silver lining", fibAnswer:"silver lining", definition:"The hope or bright side to a negative situation", example:"I can't see any silver lining to this situation", episode:"S2E1" },
  { term:"Take advantage of (sb)", fibAnswer:"taken advantage of", definition:"To exploit someone's weakness for your own benefit", example:"Be careful when drinking because you can be taken advantage of", episode:"S2E1" },
  { term:"Cheat on (sb)", fibAnswer:"cheating on", definition:"To be sexually unfaithful to a partner", example:"His wife was cheating on him", episode:"S2E2" },
  { term:"Grab (food/drinks)", fibAnswer:"grab a drink", definition:"To eat out or get a drink casually", example:"Want to grab a drink after work?", episode:"S2E2" },
  { term:"No wonder", fibAnswer:"no wonder", definition:"Used to say that something isn't surprising", example:"No wonder the blender isn't working, it's not plugged in!", episode:"S2E2" },
  { term:"Paranoid", fibAnswer:"paranoid", definition:"Feeling extremely and irrationally nervous or fearful", example:"He's paranoid about scoring well on his English exam", episode:"S2E2" },
  { term:"Quality time", fibAnswer:"quality time", definition:"Time spent meaningfully bonding with someone you care about", example:"We're going fishing to spend some quality time together.", episode:"S2E2" },
  { term:"Stab (sb) in the back", fibAnswer:"stab in the back", definition:"To betray someone", example:"Her planning a trip without him felt like a stab in the back", episode:"S2E2" },
  { term:"Stand (one's) ground", fibAnswer:"stand your ground", definition:"To maintain your position despite other people's pressure", example:"You have to stand your ground and fight for what you believe", episode:"S2E2" },
  { term:"Ecstatic", fibAnswer:"ecstatic", definition:"Very excited and filled with joy", example:"He seems ecstatic about his new job", episode:"S2E10" },
  { term:"Fall off the wagon", fibAnswer:"fell off the wagon", definition:"To return to a bad habit after quitting", example:"Unfortunately, she fell off the wagon shortly after the divorce", episode:"S2E10" },
  { term:"Get used (to sth)", fibAnswer:"getting used to", definition:"To become accustomed to something", example:"I'm finally getting used to living in the city", episode:"S2E10" },
  { term:"Psyched (about sth)", fibAnswer:"psyched", definition:"Very excited about something", example:"I'm psyched to go see the new Star Wars movie", episode:"S2E10" },
  { term:"Sober", fibAnswer:"sober", definition:"Not drunk or under the influence", example:"He's been clean and sober for five years now", episode:"S2E10" },
  { term:"Wasted", fibAnswer:"wasted", definition:"Very drunk", example:"I got wasted at their wedding", episode:"S2E10" },
  { term:"Call off", fibAnswer:"call off", definition:"To decide something won't happen; to cancel", example:"They decided to call off the wedding after she caught him cheating.", episode:"S2E11" },
  { term:"Drop a bomb (on sb)", fibAnswer:"dropped a bomb", definition:"To give a shocking or unexpected piece of news", example:"She dropped a bomb by announcing she's moving abroad.", episode:"S2E11" },
  { term:"Feel for (sb)", fibAnswer:"feel for", definition:"To empathize with someone", example:"I feel for her, her mother just passed away.", episode:"S2E11" },
  { term:"Futile", fibAnswer:"futile", definition:"Pointless, having no useful result", example:"It's futile to try to convince her, she's made up her mind.", episode:"S2E11" },
  { term:"Reluctant", fibAnswer:"reluctant", definition:"Hesitant or unwilling to do something", example:"I'm reluctant to ask her out on a second date.", episode:"S2E11" },
  { term:"Talk (sb) out of (sth)", fibAnswer:"talk me out of", definition:"To convince someone not to do something", example:"I'm ready for a new adventure, so don't try to talk me out of moving", episode:"S2E11" },
  { term:"Unfinished business", fibAnswer:"unfinished business", definition:"Matters that still need to be dealt with", example:"We have some unfinished business before we leave on vacation", episode:"S2E11" },
  { term:"Worth a shot", fibAnswer:"worth a shot", definition:"Worth trying, even if success isn't guaranteed", example:"It's worth a shot talking to her. Maybe she'll go out with you.", episode:"S2E11" },
  { term:"Get (sb) off your back", fibAnswer:"off my back", definition:"To get someone to stop criticizing or annoying you", example:"My boss won't get off my back about this new project", episode:"S2E12" },
  { term:"Pursue", fibAnswer:"pursued", definition:"To seek to attain or accomplish something", example:"Sophie was being pursued by a number of men", episode:"S2E12" },
  { term:"Stalk", fibAnswer:"stalk", definition:"To follow, watch, or harass someone obsessively", example:"It's become really common to stalk people on Facebook", episode:"S2E12" },
  { term:"Track (sb/sth) down", fibAnswer:"tracked down", definition:"To find someone or something after searching", example:"I tracked down my long-lost brother, and he lives just 5 miles away", episode:"S2E12" },
  { term:"Word on the street", fibAnswer:"word on the street", definition:"A rumor going around", example:"Word on the street is she has a new boyfriend", episode:"S2E12" },
  { term:"Be chicken", fibAnswer:"chicken", definition:"To be scared or cowardly", example:"Are you really too chicken to tell her you think she's cute?", episode:"S2E13" },
  { term:"Smoking", fibAnswer:"smoking", definition:"Really sexy or attractive (slang)", example:"My chemistry teacher is smoking", episode:"S2E13" },
  { term:"Buck", fibAnswer:"bucks", definition:"A dollar (informal)", example:"Can I borrow a few bucks?", episode:"S2E14" },
  { term:"Check (sb) out", fibAnswer:"checking you out", definition:"To look at someone with romantic interest", example:"Hey, did you notice that girl over there is checking you out?", episode:"S2E14" },
  { term:"Fall for sb", fibAnswer:"falling for", definition:"To fall in love with someone", example:"I think she's falling for her professor", episode:"S2E14" },
  { term:"Flashy", fibAnswer:"flashy", definition:"Bright, showy, sometimes expensively so", example:"I'm not sure I like that hat, it's too flashy", episode:"S2E14" },
  { term:"Get back on track", fibAnswer:"back on track", definition:"To return to the right path or schedule", example:"We need to fix this machine so we can get production back on track", episode:"S2E14" },
  { term:"Hang in there", fibAnswer:"hang in there", definition:"Used to tell someone to remain determined in a hard situation", example:"Hang in there, I'm sure you'll find a new job", episode:"S2E14" },
  { term:"Knight in shining armour", fibAnswer:"knight in shining armour", definition:"A man who heroically rescues or helps someone", example:"He was her knight in shining armour when he showed up with flowers", episode:"S2E14" },
  { term:"My bad", fibAnswer:"my bad", definition:"Used to apologize for a mistake", example:"I burned the fish, my bad.", episode:"S2E14" },
  { term:"Sharp", fibAnswer:"sharp", definition:"Attractive, stylish and well-dressed", example:"You look sharp in that shirt", episode:"S2E14" },
  { term:"Take a chill pill", fibAnswer:"chill pill", definition:"Relax, calm down", example:"I'm almost finished with this project, take a chill pill", episode:"S2E14" },
  { term:"Be into sb", fibAnswer:"into you", definition:"To be romantically attracted to someone", example:"You should ask her out, it's obvious she's into you", episode:"S2E15" },
  { term:"Be smitten", fibAnswer:"smitten", definition:"To be strongly attracted to someone", example:"I think she's smitten with her teacher", episode:"S2E15" },
  { term:"Cross the line", fibAnswer:"crossed the line", definition:"To go beyond acceptable limits", example:"He crossed the line by flirting with his boss during the meeting", episode:"S2E15" },
  { term:"Make it up (to sb)", fibAnswer:"made it up", definition:"To compensate for a mistake or bad action", example:"She missed his game, so she made it up by buying him ice cream", episode:"S2E15" },
  { term:"Split up", fibAnswer:"split up", definition:"To break up or separate from a partner", example:"They would split up if it weren't for their kids", episode:"S2E15" },
  { term:"There's no rush", fibAnswer:"no rush", definition:"There's no need to hurry", example:"There's no rush, you can take your time with that report", episode:"S2E15" },
  { term:"Trigger", fibAnswer:"triggered", definition:"To cause or activate something", example:"The smell of her perfume triggered a memory from his childhood", episode:"S2E15" },
  { term:"Be an item", fibAnswer:"an item", definition:"To be a romantic couple", example:"I heard she and that singer are an item", episode:"S2E16" },
  { term:"Be cool (with sth)", fibAnswer:"cool", definition:"To agree to or be at peace with something", example:"Are you cool if I go out with the guys tonight?", episode:"S2E16" },
  { term:"Cover (sth) up", fibAnswer:"covering something up", definition:"To hide something through deception", example:"You're a terrible liar, I can tell you're covering something up", episode:"S2E16" },
  { term:"Crazy about (sb/sth)", fibAnswer:"crazy about", definition:"To like someone or something a lot", example:"I'm crazy about their pumpkin pie ice cream!", episode:"S2E16" },
  { term:"Have a chip on one's shoulder", fibAnswer:"chip on his shoulder", definition:"To have a grudge that makes you easily argumentative", example:"He's had a chip on his shoulder since he wasn't invited to the party", episode:"S2E16" },
  { term:"Let's face it", fibAnswer:"let's face it", definition:"Used before saying something unpleasant but true", example:"Let's face it, the Polar Bears are going to go extinct if something doesn't change", episode:"S2E16" },
  { term:"Live vicariously (through sb)", fibAnswer:"vicariously", definition:"To enjoy experiences through someone else as if they were your own", example:"It's very common that parents live vicariously through their children", episode:"S2E16" },
  { term:"Load of crap", fibAnswer:"load of crap", definition:"A complete lie or nonsense", example:"He told you he found it? What a load of crap, he must have stolen it.", episode:"S2E16" },
  { term:"Be there for (sb)", fibAnswer:"here for you", definition:"To make yourself available to support someone", example:"If you need someone to talk to, I'm here for you.", episode:"S2E18" },
  { term:"Break out the champagne", fibAnswer:"break out the champagne", definition:"To celebrate something", example:"You passed your exam? Let's break out the champagne!", episode:"S2E18" },
  { term:"Get to know (sb)", fibAnswer:"gotten to know", definition:"To become more familiar with someone", example:"I still haven't gotten to know my brother's new girlfriend", episode:"S2E18" },
  { term:"Have the last word", fibAnswer:"last word", definition:"To say the final statement in an argument, feeling victorious", example:"My parents' fights never end because they both want to have the last word", episode:"S2E18" },
  { term:"Thoughtful", fibAnswer:"thoughtful", definition:"Kind and considerate towards others", example:"You wrote a very thoughtful message on my card, thanks!", episode:"S2E18" },
  { term:"Be hung up (on sth)", fibAnswer:"hung up on", definition:"To be thinking about something or someone too much", example:"He's hung up on the results of his exam", episode:"S2E19" },
  { term:"Come off as", fibAnswer:"came off as", definition:"To give a certain impression to people", example:"That guy came off as a jerk when I first met him", episode:"S2E19" },
  { term:"Condescending", fibAnswer:"condescending", definition:"Acting as if you're better or smarter than others", example:"I hate when rich people act condescending", episode:"S2E19" },
  { term:"Live the dream", fibAnswer:"living the dream", definition:"To live a very satisfying, ideal life", example:"He moved to Costa Rica and is living the dream", episode:"S2E19" },
  { term:"Out of the blue", fibAnswer:"out of the blue", definition:"Sudden and completely unexpected", example:"The politician's comment seemed really out of the blue", episode:"S2E19" },
  { term:"Road trip", fibAnswer:"road trip", definition:"A journey made by road, usually for fun", example:"We took a road trip on Route 66", episode:"S2E19" },
  { term:"Suck it up", fibAnswer:"suck it up", definition:"Accept a difficult situation without complaining", example:"I know we lost, but we have to suck it up and win the next game", episode:"S2E19" },
  { term:"Ditch sb", fibAnswer:"ditched her", definition:"To abandon someone unexpectedly", example:"She was annoying us, so we ditched her at the bar", episode:"S2E20" },
  { term:"Hog", fibAnswer:"hogs", definition:"To take up too much of something selfishly", example:"They don't sleep together anymore because he always hogs the bed", episode:"S2E20" },
  { term:"Kick in", fibAnswer:"kick in", definition:"To take effect", example:"It takes about 30 minutes for the medicine to kick in", episode:"S2E20" },
  { term:"Leftovers", fibAnswer:"leftovers", definition:"Food that remains uneaten after a meal", example:"Thanksgiving was so big we have leftovers for the next couple days.", episode:"S2E20" },
  { term:"Be on the same page", fibAnswer:"on the same page", definition:"To be thinking in the same way about something", example:"It's important to get on the same page before beginning negotiations.", episode:"S2E21" },
  { term:"Chicken out", fibAnswer:"chickened out", definition:"To not follow through with something because of fear", example:"He was going to ask her on a date, but chickened out at the last minute", episode:"S2E21" },
  { term:"Come to terms (with sth)", fibAnswer:"come to terms with", definition:"To slowly accept something difficult", example:"I'm starting to come to terms with our break up", episode:"S2E21" },
  { term:"Kudos (on sth)", fibAnswer:"kudos", definition:"Congratulations or praise", example:"Kudos for getting 100% on your test!", episode:"S2E21" },
  { term:"Stand up (to sb)", fibAnswer:"stand up to", definition:"To defend yourself against someone treating you unfairly", example:"My mom taught me to always stand up to bullies", episode:"S2E21" },
  { term:"Once in a blue moon", fibAnswer:"once in a blue moon", definition:"Very rarely", example:"I'll have a glass of wine once in a blue moon", episode:"S2E21" },
  { term:"Denial", fibAnswer:"denial", definition:"Refusing to admit to yourself that something is wrong", example:"I think you're in denial about your feelings for her", episode:"S2E22" },
  { term:"Drop it", fibAnswer:"drop it", definition:"Stop talking about a particular topic", example:"We're not going to Disney World this year, so you can drop it.", episode:"S2E22" },
  { term:"Face it", fibAnswer:"face it", definition:"Accept the truth, even if unpleasant", example:"Face it, I'll never get accepted to that university", episode:"S2E22" },
  { term:"Hit the road", fibAnswer:"hit the road", definition:"To leave a place", example:"It's getting late, we better hit the road", episode:"S2E22" },
  { term:"Look on the bright side", fibAnswer:"bright side", definition:"To focus on the positive aspects of something", example:"You lost your phone, but at least it wasn't your passport", episode:"S2E22" },
  { term:"Brown nose", fibAnswer:"brown nosing", definition:"To be overly friendly to someone in power to gain something", example:"The boss can totally tell that you're brown nosing", episode:"S2E23" },
  { term:"Drop the ball", fibAnswer:"dropped the ball", definition:"To make a silly mistake or miss an opportunity", example:"He dropped the ball when he forgot to send the package", episode:"S2E23" },
  { term:"Overhear", fibAnswer:"overheard", definition:"To involuntarily hear someone else's conversation", example:"I overheard that you are going to Paris in the spring", episode:"S2E23" },
  { term:"Ruffle (sb's) feathers", fibAnswer:"ruffling his brother's feathers", definition:"To cause annoyance, confusion, or agitation", example:"He's ruffling his brother's feathers by rooting against his favorite team", episode:"S2E23" },
  { term:"Uncalled for", fibAnswer:"uncalled for", definition:"Not necessary; rude or inappropriate given the situation", example:"His insults during the debate were completely uncalled for", episode:"S2E23" },
  { term:"Feel guilty", fibAnswer:"feel guilty", definition:"To feel that you are to blame for something", example:"I feel guilty that she got hurt after I lied", episode:"S2E24" },
  { term:"Get real", fibAnswer:"get real", definition:"To start behaving in an authentic, realistic way", example:"You think you can win the lottery every week, get real!", episode:"S2E24" },
  { term:"Make a toast", fibAnswer:"toast", definition:"To raise your glass and say nice words for a special event", example:"He made a wonderful toast to his brother at the wedding", episode:"S2E24" },
  { term:"Make sense", fibAnswer:"makes sense", definition:"To be reasonable or logical", example:"It makes sense that you got sick, you haven't slept", episode:"S2E24" },
  { term:"Over my dead body", fibAnswer:"over my dead body", definition:"A strong way to say you absolutely refuse to allow something", example:"Over my dead body you'll have the last piece of cake!", episode:"S2E24" },
  { term:"Stick with (sth)", fibAnswer:"stick with", definition:"To continue with something despite difficulties", example:"Are you going to stick with that job?", episode:"S2E24" },
  { term:"Move on", fibAnswer:"move on", definition:"To stop dwelling on the past and continue with your life", example:"You need to forget about her and move on", episode:"S2E24" },
];

const EPISODES = [...new Set(ALL_WORDS.map(w => w.episode))].sort((a, b) => {
  const p = s => { const [se, ep] = s.replace("S","").replace("E","-").split("-").map(Number); return se*100+ep; };
  return p(a)-p(b);
});

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length-1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}

// SRS algorithm
const SRS_DEFAULT = { status:'new', interval:0, easeFactor:2.5, dueDate:null, reps:0 };

function srsNext(card, rating) {
  let { interval, easeFactor, reps } = { ...SRS_DEFAULT, ...card };
  let status;
  if (rating === 'hard') {
    interval = Math.max(1, Math.floor(interval * 0.5));
    easeFactor = Math.max(1.3, easeFactor - 0.2);
    status = 'learning'; reps = 0;
  } else if (rating === 'medium') {
    if (reps === 0) interval = 3; else if (reps === 1) interval = 7; else interval = Math.round(interval * easeFactor);
    easeFactor = Math.max(1.3, easeFactor + 0.05);
    status = interval >= 21 ? 'mastered' : 'review'; reps++;
  } else { // easy
    interval = 30; status = 'mastered';
    easeFactor = Math.min(3.0, easeFactor + 0.15); reps++;
  }
  const due = new Date(); due.setDate(due.getDate() + interval);
  return { status, interval, easeFactor, dueDate: due.toISOString(), reps };
}

// localStorage
const LS_SRS='fv4_srs', LS_THEME='fv4_theme';
const loadSRS   = () => { try { return JSON.parse(localStorage.getItem(LS_SRS)||'{}'); } catch { return {}; } };
const saveSRS   = d  => { try { localStorage.setItem(LS_SRS, JSON.stringify(d)); } catch {} };
const loadTheme = () => { try { return localStorage.getItem(LS_THEME)||'light'; } catch { return 'light'; } };
const saveTheme = t  => { try { localStorage.setItem(LS_THEME, t); } catch {} };


const wordStatus  = (srs, term, ep) => { const d = srs[`${ep}::${term}`]; return d ? (d.status||'new') : 'new'; };
const statusColor = (s, dark) => ({
  mastered: dark?'#4ade80':'#1a6b3a',
  review:   dark?'#fbbf24':'#b45309',
  learning: dark?'#f87171':'#b91c1c',
  new:      dark?'#64748b':'#78523a',
}[s]||'#78523a');
const statusBg = (s, dark) => ({
  mastered: dark?'rgba(74,222,128,.15)' :'rgba(26,107,58,.12)',
  review:   dark?'rgba(251,191,36,.15)' :'rgba(180,83,9,.13)',
  learning: dark?'rgba(248,113,113,.15)':'rgba(185,28,28,.11)',
  new:      dark?'rgba(100,116,139,.15)':'rgba(120,82,58,.10)',
}[s]||'rgba(120,82,58,.10)');
const statusLabel = s => ({mastered:'Easy',review:'Medium',learning:'Hard',new:'New'}[s]||'New');

// builds the full stylesheet — called once per theme change
function buildCSS(dark) {
  const c = dark ? {
    bg:'#0f172a',bg2:'#1e293b',bg3:'#334155',surface:'#1e293b',
    border:'rgba(255,255,255,.07)',border2:'rgba(255,255,255,.14)',
    text:'#f1f5f9',text2:'#94a3b8',text3:'#475569',
    accent:'#38bdf8',accentD:'#0284c7',accentBg:'rgba(56,189,248,.12)',
    teal:'#2dd4bf',tealBg:'rgba(45,212,191,.10)',
    green:'#4ade80',greenBg:'rgba(74,222,128,.12)',
    amber:'#fbbf24',amberBg:'rgba(251,191,36,.12)',
    red:'#f87171',redBg:'rgba(248,113,113,.12)',
    shadow:'0 2px 12px rgba(0,0,0,.35)',shadowLg:'0 8px 36px rgba(0,0,0,.50)',
    overlay:'rgba(0,0,0,.65)',cardBack:'#162032',
  } : {
    bg:'#fdf0e0',
    bg2:'#f5e0c8',
    bg3:'#dfc5a0',
    surface:'#fff8ef',
    border:'rgba(120,60,20,.13)',
    border2:'rgba(120,60,20,.25)',
    text:'#1e0e05',
    text2:'#5c3010',
    text3:'#9b6540',
    accent:'#c0392b',
    accentD:'#8e1b10',
    accentBg:'rgba(192,57,43,.10)',
    teal:'#1d7a64',
    tealBg:'rgba(29,122,100,.10)',
    green:'#1a6b3a',
    greenBg:'rgba(26,107,58,.10)',
    amber:'#b45309',
    amberBg:'rgba(180,83,9,.11)',
    red:'#b91c1c',
    redBg:'rgba(185,28,28,.10)',
    shadow:'0 2px 14px rgba(100,50,10,.12)',
    shadowLg:'0 8px 32px rgba(100,50,10,.18)',
    overlay:'rgba(30,14,5,.52)',
    cardBack:'#1e0e05',
  };
  return `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:ital,wght@0,700;0,900;1,700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{font-size:16px;}
body{font-family:'Plus Jakarta Sans',sans-serif;background:${c.bg};color:${c.text};min-height:100vh;transition:background .3s,color .3s;-webkit-font-smoothing:antialiased;}
.app{min-height:100vh;}
.wrap{max-width:860px;margin:0 auto;padding:0 20px 80px;}
.header{padding:24px 20px 0;max-width:860px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px;margin-bottom:24px;}
.hbrand{display:flex;align-items:center;gap:11px;}
.hdots{display:flex;gap:5px;}
.hd{width:11px;height:11px;border-radius:50%;}
.hd-r{background:#ef4444;animation:dp 2s infinite;}
.hd-y{background:#f59e0b;animation:dp 2s .2s infinite;}
.hd-g{background:#22c55e;animation:dp 2s .4s infinite;}
@keyframes dp{0%,80%,100%{transform:scale(1);}40%{transform:scale(1.4);}}
.htitle{font-family:'Fraunces',serif;font-size:clamp(1.3rem,3vw,1.75rem);font-weight:900;color:${c.text};letter-spacing:-.02em;line-height:1;}
.htitle span{color:${c.accent};}
.theme-btn{background:${c.surface};border:1.5px solid ${c.border2};border-radius:999px;padding:8px 16px;font-size:.82rem;font-weight:700;color:${c.text2};cursor:pointer;transition:all .18s;display:flex;align-items:center;gap:6px;box-shadow:${c.shadow};}
.theme-btn:hover{border-color:${c.accent};color:${c.accent};}

/* Global summary bar */
.gsummary{background:${c.surface};border:1.5px solid ${c.border};border-radius:14px;padding:11px 18px;margin-bottom:20px;display:flex;align-items:center;gap:13px;flex-wrap:wrap;box-shadow:${c.shadow};}
.gsi{display:flex;align-items:center;gap:6px;}
.gsdot{width:9px;height:9px;border-radius:50%;flex-shrink:0;}
.gsdot-n{background:${c.text3};}
.gsdot-l{background:${c.red};}
.gsdot-r{background:${c.amber};}
.gsdot-m{background:${c.green};}
.gslabel{font-size:.75rem;font-weight:600;color:${c.text2};}
.gsval{font-size:.75rem;font-weight:800;color:${c.text};}
.gssep{width:1px;height:18px;background:${c.border2};flex-shrink:0;}

/* Episode stats bar (shown while studying) */
.epstats{background:${c.surface};border:1.5px solid ${c.border};border-radius:12px;padding:10px 16px;margin-bottom:14px;display:flex;align-items:center;gap:12px;flex-wrap:wrap;box-shadow:${c.shadow};}
.epsi{display:flex;align-items:center;gap:5px;}
.epsval{font-size:.78rem;font-weight:800;color:${c.text};}
.epslabel{font-size:.72rem;font-weight:600;color:${c.text3};}

.tabs{display:inline-flex;background:${c.surface};border:1.5px solid ${c.border};border-radius:999px;padding:4px;gap:3px;margin-bottom:20px;box-shadow:${c.shadow};}
.tab{border:none;background:transparent;border-radius:999px;padding:8px 20px;font-family:'Plus Jakarta Sans',sans-serif;font-size:.875rem;font-weight:700;color:${c.text2};cursor:pointer;transition:all .18s;display:flex;align-items:center;gap:6px;}
.tab:hover{color:${c.text};background:${c.bg2};}
.tab.active{background:${c.accent};color:#fff;box-shadow:0 2px 8px rgba(0,0,0,.18);}
.shead{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:12px;gap:10px;flex-wrap:wrap;}
.stitle{font-family:'Fraunces',serif;font-size:1.3rem;font-weight:700;color:${c.text};letter-spacing:-.01em;}
.smeta{font-size:.75rem;font-weight:600;color:${c.text3};}
.epgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(108px,1fr));gap:8px;margin-bottom:24px;}
.epc{background:${c.surface};border:1.5px solid ${c.border};border-radius:13px;padding:13px 11px 11px;cursor:pointer;transition:all .2s;position:relative;overflow:hidden;box-shadow:${c.shadow};}
.epc::after{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:${c.accent};transform:scaleX(0);transform-origin:left;transition:transform .22s;}
.epc:hover{border-color:${c.accent};transform:translateY(-2px);box-shadow:${c.shadowLg};}
.epc:hover::after{transform:scaleX(1);}
.epc.act{background:${c.accent};border-color:${c.accentD};transform:translateY(-3px);box-shadow:${c.shadowLg};}
.epc.act::after{transform:scaleX(1);background:rgba(255,255,255,.35);}
.epstar{position:absolute;top:5px;right:7px;font-size:.72rem;}
.epname{font-family:'Fraunces',serif;font-size:1rem;font-weight:700;color:${c.text};display:block;margin-bottom:3px;}
.epc.act .epname{color:#fff;}
.epcount{font-size:.67rem;font-weight:700;color:${c.text3};}
.epc.act .epcount{color:rgba(255,255,255,.65);}
.epbar{height:3px;background:${c.bg3};border-radius:2px;margin-top:8px;overflow:hidden;}
.epbarfill{height:100%;background:${c.green};border-radius:2px;transition:width .4s;}
.epc.act .epbar{background:rgba(255,255,255,.25);}
.epc.act .epbarfill{background:#fff;}

/* Modal */
.moverlay{position:fixed;inset:0;background:${c.overlay};backdrop-filter:blur(6px);z-index:100;display:flex;align-items:center;justify-content:center;padding:16px;animation:moin .18s ease;}
@keyframes moin{from{opacity:0;}to{opacity:1;}}
.modal{background:${c.surface};border:1.5px solid ${c.border2};border-radius:22px;padding:28px 24px 24px;width:100%;max-width:520px;box-shadow:${c.shadowLg};animation:mpop .28s cubic-bezier(.34,1.56,.64,1);}
@keyframes mpop{from{opacity:0;transform:scale(.92) translateY(14px);}to{opacity:1;transform:scale(1) translateY(0);}}
.mep{display:inline-flex;align-items:center;gap:7px;background:${c.accentBg};color:${c.accent};border-radius:999px;padding:5px 14px;font-size:.78rem;font-weight:700;margin-bottom:12px;border:1px solid ${c.accent}44;}
.mtitle{font-family:'Fraunces',serif;font-size:1.5rem;font-weight:700;color:${c.text};margin-bottom:5px;letter-spacing:-.02em;}
.msub{font-size:.82rem;font-weight:500;color:${c.text2};margin-bottom:20px;line-height:1.5;}
.mmodes{display:flex;flex-direction:column;gap:9px;margin-bottom:16px;}
.mmode{display:flex;align-items:center;gap:13px;background:${c.bg2};border:1.5px solid ${c.border};border-radius:13px;padding:14px 16px;cursor:pointer;transition:all .18s;text-align:left;width:100%;}
.mmode:hover{border-color:${c.accent};background:${c.accentBg};transform:translateX(3px);}
.micon{width:42px;height:42px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:1.25rem;flex-shrink:0;}
.mname{font-size:.92rem;font-weight:700;color:${c.text};margin-bottom:2px;}
.mdesc{font-size:.72rem;font-weight:500;color:${c.text2};line-height:1.4;}
.mclose{width:100%;background:transparent;border:1.5px solid ${c.border2};border-radius:999px;padding:10px;font-family:'Plus Jakarta Sans',sans-serif;font-size:.83rem;font-weight:700;color:${c.text2};cursor:pointer;transition:all .18s;}
.mclose:hover{border-color:${c.text3};color:${c.text};}

/* Study nav */
.snav{display:flex;align-items:center;gap:10px;margin-bottom:16px;flex-wrap:wrap;}
.backbtn{display:inline-flex;align-items:center;gap:6px;background:${c.surface};border:1.5px solid ${c.border2};border-radius:999px;padding:8px 17px;font-family:'Plus Jakarta Sans',sans-serif;font-size:.83rem;font-weight:700;color:${c.text2};cursor:pointer;transition:all .18s;box-shadow:${c.shadow};}
.backbtn:hover{border-color:${c.accent};color:${c.accent};}
.sbadge{display:inline-flex;align-items:center;gap:8px;background:${c.accentBg};border:1px solid ${c.accent}44;border-radius:999px;padding:7px 16px;}
.sbep{font-family:'Fraunces',serif;font-size:.92rem;font-weight:700;color:${c.accent};}
.sbsep{width:1px;height:13px;background:${c.border2};}
.sbmode{font-size:.73rem;font-weight:600;color:${c.text2};}

/* Progress bar */
.progrow{display:flex;align-items:center;gap:12px;margin-bottom:16px;}
.progtrack{flex:1;height:7px;background:${c.bg3};border-radius:4px;overflow:hidden;}
.progfill{height:100%;background:linear-gradient(90deg,${c.accent} 0%,${c.teal} 100%);border-radius:4px;transition:width .5s cubic-bezier(.4,0,.2,1);}
.proglabel{font-size:.76rem;font-weight:700;color:${c.text3};white-space:nowrap;}

/* Flashcard */
.fcwrap{margin-bottom:14px;}
.fcscene{perspective:1400px;cursor:pointer;user-select:none;margin-bottom:14px;}
.fc3d{position:relative;width:100%;height:310px;transform-style:preserve-3d;transition:transform .56s cubic-bezier(.4,0,.2,1);}
.fc3d.fl{transform:rotateY(180deg);}
@media(max-width:520px){.fc3d{height:270px;}}
.fcface{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:20px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:32px 28px;}
@media(max-width:480px){.fcface{padding:24px 18px;}}
.fcfront{background:${c.surface};border:1.5px solid ${c.border2};box-shadow:${c.shadowLg};}
.fctag{font-size:.66rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${c.accent};background:${c.accentBg};border:1px solid ${c.accent}44;border-radius:999px;padding:4px 11px;margin-bottom:18px;}
.fcterm{font-family:'Fraunces',serif;font-size:clamp(2rem,5vw,3rem);font-weight:700;color:${c.text};line-height:1.1;letter-spacing:-.02em;margin-bottom:8px;}
.fchint{font-size:.75rem;font-weight:600;color:${c.text3};margin-top:10px;}
.fcback{background:${c.cardBack};transform:rotateY(180deg);border:1.5px solid rgba(255,255,255,.08);box-shadow:${c.shadowLg};}
.fcbtag{font-size:.66rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-bottom:14px;}
.fcdef{font-size:clamp(1.05rem,2.6vw,1.22rem);font-weight:600;color:rgba(255,255,255,.93);line-height:1.55;margin-bottom:14px;}
.fcex-btn{background:rgba(255,191,36,.15);border:1px solid rgba(251,191,36,.3);border-radius:999px;padding:6px 16px;font-size:.74rem;font-weight:700;color:#fbbf24;cursor:pointer;transition:all .18s;margin-top:2px;}
.fcex-btn:hover{background:rgba(251,191,36,.25);}
.fcex{font-size:.82rem;font-weight:500;font-style:italic;color:#fbbf24;line-height:1.5;background:rgba(251,191,36,.1);border-radius:9px;border-left:2.5px solid #fbbf24;padding:8px 13px;text-align:left;width:100%;margin-top:8px;animation:fup .2s ease;}

/* SRS buttons — Easy / Medium / Hard in a row, no subtitle */
.srsbtns{display:flex;justify-content:center;gap:10px;flex-wrap:nowrap;}
.srsbtn{display:flex;align-items:center;justify-content:center;border:none;border-radius:13px;padding:13px 0;font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;transition:all .18s;flex:1;max-width:160px;font-size:.9rem;font-weight:800;}
.srsbtn:hover{transform:translateY(-2px);filter:brightness(1.08);}
.srsbtn-e{background:${c.greenBg};border:2px solid ${c.green}66;color:${c.green};}
.srsbtn-m{background:${c.amberBg};border:2px solid ${c.amber}66;color:${c.amber};}
.srsbtn-h{background:${c.redBg};border:2px solid ${c.red}66;color:${c.red};}

/* Word list panel toggle */
.wltoggle{display:flex;align-items:center;justify-content:center;gap:7px;background:${c.surface};border:1.5px solid ${c.border2};border-radius:999px;padding:8px 18px;font-size:.8rem;font-weight:700;color:${c.text2};cursor:pointer;transition:all .18s;margin:0 auto 14px;box-shadow:${c.shadow};}
.wltoggle:hover{border-color:${c.accent};color:${c.accent};}
.wlpanel{background:${c.surface};border:1.5px solid ${c.border};border-radius:16px;padding:14px;margin-bottom:14px;max-height:260px;overflow-y:auto;box-shadow:${c.shadow};animation:fup .22s ease;}
.wlitem{display:flex;align-items:center;gap:9px;padding:7px 9px;border-radius:8px;transition:background .14s;margin-bottom:1px;}
.wlitem:hover{background:${c.bg2};}
.wldot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.wlterm{font-size:.83rem;font-weight:700;flex:1;color:${c.text};}
.wlbadge{font-size:.63rem;font-weight:700;padding:2px 8px;border-radius:999px;}

/* Quiz */
.qcard{background:${c.surface};border:1.5px solid ${c.border};border-radius:19px;padding:24px 24px 20px;margin-bottom:13px;box-shadow:${c.shadow};}
.qlabel{font-size:.66rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${c.accent};display:flex;align-items:center;gap:6px;margin-bottom:8px;}
.qq{font-family:'Fraunces',serif;font-size:clamp(1.2rem,3vw,1.6rem);font-weight:700;color:${c.text};line-height:1.25;letter-spacing:-.01em;}
.qctx{display:block;margin-top:10px;font-size:.82rem;font-weight:500;font-style:italic;color:${c.teal};background:${c.tealBg};border-left:2.5px solid ${c.teal};border-radius:0 8px 8px 0;padding:7px 12px;line-height:1.5;}
.opts{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:13px;}
@media(max-width:460px){.opts{grid-template-columns:1fr;}}
.opt{background:${c.surface};border:2px solid ${c.border2};border-radius:12px;padding:14px 16px;font-family:'Plus Jakarta Sans',sans-serif;font-size:.88rem;font-weight:600;color:${c.text};cursor:pointer;transition:all .18s;text-align:left;line-height:1.4;box-shadow:${c.shadow};}
.opt:hover:not(:disabled){border-color:${c.accent};background:${c.accentBg};transform:translateY(-2px);box-shadow:${c.shadowLg};}
.opt.correct{background:${c.greenBg};border-color:${c.green};color:${c.green};font-weight:700;}
.opt.wrong{background:${c.redBg};border-color:${c.red};color:${c.red};}
.opt:disabled{cursor:default;transform:none;}
.qstreak{display:flex;align-items:center;gap:6px;background:${c.amberBg};border:1.5px solid ${c.amber}55;border-radius:999px;padding:5px 14px;font-size:.78rem;font-weight:800;color:${c.amber};margin-bottom:12px;width:fit-content;}
.qscore{display:flex;align-items:center;gap:6px;background:${c.accentBg};border:1.5px solid ${c.accent}44;border-radius:999px;padding:5px 14px;font-size:.78rem;font-weight:800;color:${c.accent};margin-bottom:12px;width:fit-content;}
.qfeedback{padding:12px 16px;border-radius:12px;font-weight:700;font-size:.88rem;margin-bottom:12px;animation:fup .2s ease;}
.qfeedback.ok{background:${c.greenBg};color:${c.green};border:1.5px solid ${c.green}44;}
.qfeedback.no{background:${c.redBg};color:${c.red};border:1.5px solid ${c.red}44;}

/* Fill in blank */
.fibcard{background:${c.surface};border:1.5px solid ${c.border};border-radius:19px;padding:24px 24px 20px;margin-bottom:13px;box-shadow:${c.shadow};}
.fiblabel{font-size:.66rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${c.teal};margin-bottom:6px;}
.fibdef{font-family:'Fraunces',serif;font-size:clamp(1.08rem,2.5vw,1.38rem);font-weight:700;color:${c.text};line-height:1.35;margin-bottom:18px;}
.fibsent{font-size:.98rem;font-weight:600;color:${c.text2};line-height:2.4;font-style:italic;}
.fibinput{display:inline-block;background:${c.accentBg};border:none;border-bottom:2.5px solid ${c.accent};border-radius:5px 5px 0 0;padding:3px 9px 4px;font-family:'Plus Jakarta Sans',sans-serif;font-size:.95rem;font-weight:700;color:${c.accent};outline:none;width:170px;text-align:center;font-style:normal;transition:all .2s;}
.fibinput:focus{border-bottom-color:${c.text};}
.fibinput.correct{border-bottom-color:${c.green};color:${c.green};background:${c.greenBg};}
.fibinput.wrong{border-bottom-color:${c.red};color:${c.red};background:${c.redBg};}
.fibfeedback{margin-top:11px;font-size:.83rem;font-weight:700;color:${c.red};display:flex;align-items:center;gap:6px;}
.fibfeedback strong{color:${c.text};}

/* Matching */
.matchgrid{display:grid;grid-template-columns:1fr 1fr;gap:11px;margin-bottom:13px;}
@media(max-width:460px){.matchgrid{grid-template-columns:1fr;}}
.matchcollabel{font-size:.66rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${c.text3};margin-bottom:7px;}
.matchitem{background:${c.surface};border:2px solid ${c.border2};border-radius:10px;padding:11px 13px;font-size:.81rem;font-weight:600;color:${c.text};cursor:pointer;transition:all .18s;line-height:1.4;min-height:48px;display:flex;align-items:center;margin-bottom:6px;box-shadow:${c.shadow};user-select:none;}
.matchitem:hover:not(.matched):not(.shake){border-color:${c.accent};background:${c.accentBg};transform:translateX(2px);}
.matchitem.sel{border-color:${c.accent};background:${c.accent};color:#fff;}
.matchitem.matched{border-color:${c.green};background:${c.greenBg};color:${c.green};cursor:default;font-weight:700;}
.matchitem.shake{border-color:${c.red};background:${c.redBg};animation:shake .38s ease;}
@keyframes shake{0%,100%{transform:translateX(0);}25%{transform:translateX(-7px);}75%{transform:translateX(7px);}}

/* Word list */
.wordlist{display:flex;flex-direction:column;gap:6px;}
.wordrow{background:${c.surface};border:1.5px solid ${c.border};border-radius:11px;padding:12px 16px;display:grid;grid-template-columns:185px 1fr auto;gap:12px;align-items:start;transition:all .18s;box-shadow:${c.shadow};}
@media(max-width:560px){.wordrow{grid-template-columns:1fr auto;}}
.wordrow:hover{border-color:${c.border2};box-shadow:${c.shadowLg};}
.wordterm{font-family:'Fraunces',serif;font-size:.96rem;font-weight:700;color:${c.accent};}
.worddef{font-size:.8rem;font-weight:500;color:${c.text2};line-height:1.5;}
@media(max-width:560px){.worddef{grid-column:1/-1;margin-top:-4px;}}
.wordex{font-size:.71rem;font-style:italic;color:${c.teal};margin-top:3px;}
.wsbadge{font-size:.63rem;font-weight:700;padding:3px 9px;border-radius:999px;white-space:nowrap;margin-top:1px;}
.legend{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;}
.legenditem{display:flex;align-items:center;gap:5px;border-radius:999px;padding:4px 12px;font-size:.73rem;font-weight:700;}

/* Results */
.results{background:${c.surface};border:1.5px solid ${c.border2};border-radius:22px;padding:44px 28px 36px;text-align:center;box-shadow:${c.shadowLg};animation:pop .4s cubic-bezier(.34,1.56,.64,1);}
@keyframes pop{from{opacity:0;transform:scale(.9) translateY(16px);}to{opacity:1;transform:scale(1) translateY(0);}}
.rmedal{font-size:3.6rem;display:block;margin-bottom:14px;line-height:1;}
.rscorebox{display:inline-flex;flex-direction:column;align-items:center;background:${c.cardBack};border-radius:18px;padding:14px 44px;margin-bottom:14px;box-shadow:${c.shadowLg};}
.rpct{font-family:'Fraunces',serif;font-size:3.6rem;font-weight:900;color:#fbbf24;line-height:1;letter-spacing:-.03em;}
.rfrac{font-size:.76rem;font-weight:700;color:rgba(255,255,255,.4);margin-top:3px;}
.rquote{font-family:'Fraunces',serif;font-style:italic;font-size:1.08rem;color:${c.text};margin-bottom:22px;line-height:1.4;}
.rrow{display:flex;gap:9px;justify-content:center;flex-wrap:wrap;}
.btn{display:inline-flex;align-items:center;gap:7px;border:none;border-radius:999px;padding:11px 24px;font-family:'Plus Jakarta Sans',sans-serif;font-size:.875rem;font-weight:700;cursor:pointer;transition:all .18s;white-space:nowrap;}
.btn:hover{transform:translateY(-1px);}
.btn-primary{background:${c.accent};color:#fff;box-shadow:0 3px 12px ${c.accent}44;}
.btn-primary:hover{filter:brightness(1.1);}
.btn-ghost{background:${c.surface};color:${c.text2};border:1.5px solid ${c.border2};box-shadow:${c.shadow};}
.btn-ghost:hover{border-color:${c.accent};color:${c.accent};}

/* Toast */
.toastroot{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:999;pointer-events:none;}
.toast{background:${dark?'#1e293b':'#1e0e05'};color:#f1f5f9;font-size:.83rem;font-weight:700;padding:9px 22px;border-radius:999px;box-shadow:${c.shadowLg};white-space:nowrap;display:flex;align-items:center;gap:7px;border:1px solid rgba(255,255,255,.12);animation:tup .26s cubic-bezier(.34,1.56,.64,1);}
@keyframes tup{from{opacity:0;transform:translateY(10px) scale(.93);}to{opacity:1;transform:translateY(0) scale(1);}}
.fup{animation:fup .3s ease both;}
@keyframes fup{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
.tc{text-align:center;}
@media(max-width:440px){.epgrid{grid-template-columns:repeat(3,1fr);}}
/* Quiz */
.qcard{background:${c.surface};border:1.5px solid ${c.border};border-radius:19px;padding:24px 24px 20px;margin-bottom:13px;box-shadow:${c.shadow};}
.qlabel{font-size:.66rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${c.accent};display:flex;align-items:center;gap:6px;margin-bottom:8px;}
.qq{font-family:'Fraunces',serif;font-size:clamp(1.2rem,3vw,1.6rem);font-weight:700;color:${c.text};line-height:1.25;letter-spacing:-.01em;}
.qctx{display:block;margin-top:10px;font-size:.82rem;font-weight:500;font-style:italic;color:${c.teal};background:${c.tealBg};border-left:2.5px solid ${c.teal};border-radius:0 8px 8px 0;padding:7px 12px;line-height:1.5;}
.opts{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:13px;}
@media(max-width:460px){.opts{grid-template-columns:1fr;}}
.opt{background:${c.surface};border:2px solid ${c.border2};border-radius:12px;padding:14px 16px;font-family:'Plus Jakarta Sans',sans-serif;font-size:.88rem;font-weight:600;color:${c.text};cursor:pointer;transition:all .18s;text-align:left;line-height:1.4;box-shadow:${c.shadow};}
.opt:hover:not(:disabled){border-color:${c.accent};background:${c.accentBg};transform:translateY(-2px);box-shadow:${c.shadowLg};}
.opt.correct{background:${c.greenBg};border-color:${c.green};color:${c.green};font-weight:700;}
.opt.wrong{background:${c.redBg};border-color:${c.red};color:${c.red};}
.opt:disabled{cursor:default;transform:none;}
.qstreak{display:flex;align-items:center;gap:6px;background:${c.amberBg};border:1.5px solid ${c.amber}55;border-radius:999px;padding:5px 14px;font-size:.78rem;font-weight:800;color:${c.amber};margin-bottom:12px;width:fit-content;}
.qscore{display:flex;align-items:center;gap:6px;background:${c.accentBg};border:1.5px solid ${c.accent}44;border-radius:999px;padding:5px 14px;font-size:.78rem;font-weight:800;color:${c.accent};margin-bottom:12px;width:fit-content;}
.qfeedback{padding:12px 16px;border-radius:12px;font-weight:700;font-size:.88rem;margin-bottom:12px;animation:fup .2s ease;}
.qfeedback.ok{background:${c.greenBg};color:${c.green};border:1.5px solid ${c.green}44;}
.qfeedback.no{background:${c.redBg};color:${c.red};border:1.5px solid ${c.red}44;}
`;}


export default function App() {
  const [dark, setDark] = useState(() => loadTheme() === 'dark');
  const [srsData, setSrsData] = useState(loadSRS);
  const [screen, setScreen] = useState('home');
  const [activeTab, setActiveTab] = useState('episodes');
  const [modalEp, setModalEp] = useState(null);
  const [selectedEp, setSelectedEp] = useState(null);
  const [studyMode, setStudyMode] = useState(null);
  const [toast, setToast] = useState(null);
  const toastRef = useRef();

  useEffect(() => { saveTheme(dark ? 'dark' : 'light'); }, [dark]);
  useEffect(() => { saveSRS(srsData); }, [srsData]);

  const showToast = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(null), 2000);
  }, []);

  const updateSRS = useCallback((term, episode, rating) => {
    setSrsData(prev => {
      const key = `${episode}::${term}`;
      return { ...prev, [key]: srsNext(prev[key] || SRS_DEFAULT, rating) };
    });
  }, []);

  const epWords = useMemo(() => selectedEp ? ALL_WORDS.filter(w => w.episode === selectedEp) : [], [selectedEp]);

  const globalCounts = useMemo(() => {
    const c = { new:0, learning:0, review:0, mastered:0 };
    ALL_WORDS.forEach(w => { const s = wordStatus(srsData, w.term, w.episode); c[s] = (c[s]||0)+1; });
    return c;
  }, [srsData]);

  const epMastered = useCallback((ep) =>
    ALL_WORDS.filter(w => w.episode === ep && wordStatus(srsData, w.term, ep) === 'mastered').length, [srsData]);

  const epStats = useMemo(() => {
    if (!selectedEp) return null;
    const words = ALL_WORDS.filter(w => w.episode === selectedEp);
    const counts = { new:0, learning:0, review:0, mastered:0 };
    words.forEach(w => { const s = wordStatus(srsData, w.term, selectedEp); counts[s]++; });
    return { ...counts, total: words.length };
  }, [srsData, selectedEp]);

  const launchMode = (mode) => { setStudyMode(mode); setScreen('study'); setModalEp(null); };
  const goHome     = () => { setScreen('home'); setStudyMode(null); setSelectedEp(null); };
  const css = useMemo(() => buildCSS(dark), [dark]);

  const MODES = [
    { id:'flashcards', icon:'🃏', name:'Flashcards', desc:'Flip cards and rate: Easy, Medium, or Hard', bg:'rgba(99,102,241,.13)', color:'#6366f1' },
    { id:'quiz',       icon:'🎮', name:'Quiz Game',  desc:'Multiple choice — 4 options per question',  bg:'rgba(8,145,178,.13)',  color:'#0891b2' },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="header">
          <div className="hbrand">
            <div className="hdots"><div className="hd hd-r"/><div className="hd hd-y"/><div className="hd hd-g"/></div>
            <div className="htitle">The One With <span>The Vocab</span></div>
          </div>
          <button className="theme-btn" onClick={() => setDark(d => !d)}>{dark ? '☀️ Light' : '🌙 Dark'}</button>
        </div>

        <div className="wrap">
          {/* Global summary — shown on home only */}
          {screen === 'home' && (
            <div className="gsummary fup">
              <div className="gsi"><div className="gsdot gsdot-n"/><span className="gslabel">New</span><span className="gsval">{globalCounts.new}</span></div>
              <div className="gssep"/>
              <div className="gsi"><div className="gsdot gsdot-l"/><span className="gslabel">Hard</span><span className="gsval">{globalCounts.learning}</span></div>
              <div className="gssep"/>
              <div className="gsi"><div className="gsdot gsdot-r"/><span className="gslabel">Medium</span><span className="gsval">{globalCounts.review}</span></div>
              <div className="gssep"/>
              <div className="gsi"><div className="gsdot gsdot-m"/><span className="gslabel">Easy</span><span className="gsval">{globalCounts.mastered}</span></div>
              <div className="gssep"/>
              <div className="gsi"><span className="gslabel">Total</span><span className="gsval">{ALL_WORDS.length}</span></div>
            </div>
          )}

          {/* Episode stats — shown while studying */}
          {screen === 'study' && epStats && (
            <div className="epstats fup">
              <div className="epsi"><div className="gsdot gsdot-m"/><span className="epsval">{epStats.mastered}</span><span className="epslabel">Easy</span></div>
              <div className="gssep"/>
              <div className="epsi"><div className="gsdot gsdot-r"/><span className="epsval">{epStats.review}</span><span className="epslabel">Medium</span></div>
              <div className="gssep"/>
              <div className="epsi"><div className="gsdot gsdot-l"/><span className="epsval">{epStats.learning}</span><span className="epslabel">Hard</span></div>
              <div className="gssep"/>
              <div className="epsi"><div className="gsdot gsdot-n"/><span className="epsval">{epStats.new}</span><span className="epslabel">New</span></div>
              <div className="gssep"/>
              <div className="epsi"><span className="epsval">{epStats.mastered}</span><span className="epslabel">/ {epStats.total} learned</span></div>
            </div>
          )}

          {screen === 'home' && (
            <>
              <div className="tabs fup">
                <button className={`tab${activeTab==='episodes'?' active':''}`} onClick={()=>setActiveTab('episodes')}>📺 Episodes</button>
                <button className={`tab${activeTab==='all'?' active':''}`} onClick={()=>setActiveTab('all')}>📚 All Words</button>
              </div>

              {activeTab === 'episodes' && (
                <div className="fup">
                  <div className="shead">
                    <span className="stitle">Choose an episode</span>
                    <span className="smeta">{EPISODES.length} episodes · click to study</span>
                  </div>
                  <div className="epgrid">
                    {EPISODES.map(ep => {
                      const total = ALL_WORDS.filter(w=>w.episode===ep).length;
                      const mc    = epMastered(ep);
                      const done  = mc===total && total>0;
                      return (
                        <div key={ep} className={`epc${selectedEp===ep?' act':''}${done?' done':''}`}
                          onClick={() => { setSelectedEp(ep); setModalEp(ep); }}>
                          {done && <span className="epstar">⭐</span>}
                          <span className="epname">{ep}</span>
                          <span className="epcount">{mc}/{total}</span>
                          <div className="epbar"><div className="epbarfill" style={{width:`${total>0?(mc/total)*100:0}%`}}/></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'all' && (
                <div className="fup">
                  <div className="shead">
                    <span className="stitle">All vocabulary</span>
                    <span className="smeta">{ALL_WORDS.length} words total</span>
                  </div>
                  <div className="wordlist">
                    {ALL_WORDS.map(w => {
                      const st  = wordStatus(srsData, w.term, w.episode);
                      const col = statusColor(st, dark);
                      const bg  = statusBg(st, dark);
                      return (
                        <div key={`${w.episode}::${w.term}`} className="wordrow" style={{borderLeftColor:col,borderLeftWidth:'3px'}}>
                          <div><div className="wordterm">{w.term}</div><div style={{fontSize:'.66rem',color:'#94a3b8',marginTop:2}}>{w.episode}</div></div>
                          <div><div className="worddef">{w.definition}</div><div className="wordex">"{w.example}"</div></div>
                          <div className="wsbadge" style={{background:bg,color:col}}>{statusLabel(st)}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {screen === 'study' && selectedEp && studyMode && (
            <div className="fup">
              <div className="snav">
                <button className="backbtn" onClick={goHome}>← Back</button>
                <div className="sbadge">
                  <span className="sbep">{selectedEp}</span>
                  <div className="sbsep"/>
                  <span className="sbmode">{MODES.find(m=>m.id===studyMode)?.name}</span>
                </div>
              </div>
              {studyMode==='flashcards' && <FlashcardMode words={epWords} episode={selectedEp} srsData={srsData} onSRS={updateSRS} showToast={showToast} dark={dark}/>}
              {studyMode==='quiz'       && <QuizMode      words={epWords} episode={selectedEp} srsData={srsData} onSRS={updateSRS} showToast={showToast} dark={dark}/>}
            </div>
          )}
        </div>

        {modalEp && (
          <div className="moverlay" onClick={()=>setModalEp(null)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <div className="mep">📺 {modalEp}</div>
              <div className="mtitle">How do you want to study?</div>
              <div className="msub">{ALL_WORDS.filter(w=>w.episode===modalEp).length} words · {epMastered(modalEp)} easy</div>
              <div className="mmodes">
                {MODES.map(m => (
                  <button key={m.id} className="mmode" onClick={()=>{setSelectedEp(modalEp);launchMode(m.id);}}>
                    <div className="micon" style={{background:m.bg,color:m.color}}>{m.icon}</div>
                    <div><div className="mname">{m.name}</div><div className="mdesc">{m.desc}</div></div>
                  </button>
                ))}
              </div>
              <button className="mclose" onClick={()=>setModalEp(null)}>✕ Cancel</button>
            </div>
          </div>
        )}

        {toast && <div className="toastroot"><div className="toast">{toast}</div></div>}
      </div>
    </>
  );
}


function ProgressBar({current, total}) {
  return (
    <div className="progrow">
      <div className="progtrack"><div className="progfill" style={{width:`${total>0?(current/total)*100:0}%`}}/></div>
      <div className="proglabel">{current}/{total}</div>
    </div>
  );
}


function Results({score, total, correct, onRetry}) {
  const medal = score>=90?'🏆':score>=70?'🥇':score>=50?'🥈':'📚';
  const quote = score>=90?"Could I BE any more impressive?!"
    :score>=70?"We were on a break… from mistakes!"
    :score>=50?"How you doin'? Keep practicing!"
    :"Oh. My. God. Time to hit the books!";
  return (
    <div className="results">
      <span className="rmedal">{medal}</span>
      <div className="rscorebox">
        <div className="rpct">{score}%</div>
        <div className="rfrac">{correct} / {total} correct</div>
      </div>
      <div className="rquote">"{quote}"</div>
      <div className="rrow"><button className="btn btn-primary" onClick={onRetry}>↩ Try again</button></div>
    </div>
  );
}

// Flashcard mode
function FlashcardMode({words, episode, srsData, onSRS, showToast, dark}) {
  const [deck, setDeck]       = useState(()=>shuffle(words));
  const [idx, setIdx]         = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showEx, setShowEx]   = useState(false);
  const [correct, setCorrect] = useState(0);
  const [done, setDone]       = useState(false);
  const [showList, setShowList] = useState(false);

  if (done) return <Results
    score={Math.round((correct/deck.length)*100)} total={deck.length} correct={correct}
    onRetry={()=>{setDeck(shuffle(words));setIdx(0);setFlipped(false);setShowEx(false);setCorrect(0);setDone(false);setShowList(false);}}/>;

  const w = deck[idx];
  const rate = (rating) => {
    onSRS(w.term, episode, rating);
    if (rating !== 'hard') setCorrect(c=>c+1);
    showToast({hard:'🔴 Hard', medium:'🟡 Medium', easy:'🟢 Easy'}[rating]);
    setFlipped(false); setShowEx(false);
    setTimeout(()=>{ if(idx===deck.length-1) setDone(true); else setIdx(i=>i+1); }, 220);
  };

  return (
    <div className="fcwrap">
      <ProgressBar current={idx} total={deck.length}/>
      <button className="wltoggle" onClick={()=>setShowList(s=>!s)}>
        {showList ? '▲ Hide word list' : '▼ Show episode words'}
      </button>
      {showList && (
        <div className="wlpanel fup">
          {words.map(word => {
            const st  = wordStatus(srsData, word.term, episode);
            const col = statusColor(st, dark);
            const bg  = statusBg(st, dark);
            return (
              <div key={word.term} className="wlitem">
                <div className="wldot" style={{background:col}}/>
                <div className="wlterm">{word.term}</div>
                <div className="wlbadge" style={{background:bg,color:col}}>{statusLabel(st)}</div>
              </div>
            );
          })}
        </div>
      )}

      <div className="fcscene" onClick={()=>{ setFlipped(f=>!f); setShowEx(false); }}>
        <div className={`fc3d${flipped?' fl':''}`}>
          <div className="fcface fcfront">
            <span className="fctag">📺 {episode} · tap to flip</span>
            <div className="fcterm">{w.term}</div>
            <div className="fchint">↕ tap to see definition</div>
          </div>
          <div className="fcface fcback">
            <span className="fcbtag">Definition</span>
            <div className="fcdef">{w.definition}</div>
            {!showEx
              ? <button className="fcex-btn" onClick={e=>{e.stopPropagation();setShowEx(true);}}>👁 Show example</button>
              : <div className="fcex">"{w.example}"</div>
            }
          </div>
        </div>
      </div>

      {flipped && (
        <div className="srsbtns fup">
          <button className="srsbtn srsbtn-e" onClick={e=>{e.stopPropagation();rate('easy');}}>🟢 Easy</button>
          <button className="srsbtn srsbtn-m" onClick={e=>{e.stopPropagation();rate('medium');}}>🟡 Medium</button>
          <button className="srsbtn srsbtn-h" onClick={e=>{e.stopPropagation();rate('hard');}}>🔴 Hard</button>
        </div>
      )}
    </div>
  );
}

// Quiz mode
function QuizMode({words, episode, srsData, onSRS, showToast, dark}) {
  const [questions] = useState(()=>shuffle(words).map(w=>({
    w, opts: shuffle([w.definition,...shuffle(ALL_WORDS.filter(x=>x.term!==w.term)).slice(0,3).map(x=>x.definition)])
  })));
  const [idx, setIdx]         = useState(0);
  const [sel, setSel]         = useState(null);
  const [score, setScore]     = useState(0);
  const [streak, setStreak]   = useState(0);
  const [bestStreak, setBest] = useState(0);
  const [feedback, setFeedback] = useState(null); // {ok, msg}
  const [done, setDone]       = useState(false);

  if (done) return <Results
    score={Math.round((score/questions.length)*100)} total={questions.length} correct={score}
    onRetry={()=>{setIdx(0);setSel(null);setScore(0);setStreak(0);setBest(0);setFeedback(null);setDone(false);}}/>;

  const q = questions[idx];
  const answered = sel !== null;

  const pick = opt => {
    if (answered) return;
    setSel(opt);
    const ok = opt===q.w.definition;
    if (ok) {
      const ns = streak+1;
      setStreak(ns); if(ns>bestStreak) setBest(ns);
      setScore(s=>s+1);
      onSRS(q.w.term,episode,'easy');
      const streakMsg = ns>=5?` — ${ns} in a row`:'';
      setFeedback({ok:true, msg:`✓ Correct${streakMsg}`});
    } else {
      setStreak(0);
      onSRS(q.w.term,episode,'hard');
      setFeedback({ok:false, msg:`✗ The answer was: "${q.w.definition}"`});
    }
  };

  const next = () => {
    setFeedback(null); setSel(null);
    if(idx===questions.length-1) setDone(true); else setIdx(i=>i+1);
  };

  return (
    <>
      <ProgressBar current={idx} total={questions.length}/>
      <div style={{display:'flex',gap:9,marginBottom:12,flexWrap:'wrap'}}>
        <div className="qscore">🏅 Score: {score}/{idx+(answered?1:0)}</div>
        {streak>=2 && <div className="qstreak">🔥 Streak: {streak}</div>}
        {bestStreak>=3 && streak<bestStreak && <div className="qstreak" style={{opacity:.6}}>Best: {bestStreak}</div>}
      </div>
      <div className="qcard">
        <div className="qlabel"><span>💬</span> What does this mean?</div>
        <div className="qq">{q.w.term}</div>
        {q.w.example && <span className="qctx">"{q.w.example.replace(new RegExp(q.w.fibAnswer||q.w.term.split(' ')[0],'i'),'___')}"</span>}
      </div>
      {feedback && (
        <div className={`qfeedback ${feedback.ok?'ok':'no'} fup`}>{feedback.msg}</div>
      )}
      <div className="opts">
        {q.opts.map((opt,i)=>(
          <button key={i}
            className={`opt${sel===opt?(opt===q.w.definition?' correct':' wrong'):''}${answered&&opt===q.w.definition?' correct':''}`}
            disabled={answered} onClick={()=>pick(opt)}>{opt}</button>
        ))}
      </div>
      {answered && <div className="tc fup"><button className="btn btn-primary" onClick={next}>{idx===questions.length-1?'See results →':'Next →'}</button></div>}
    </>
  );
}
