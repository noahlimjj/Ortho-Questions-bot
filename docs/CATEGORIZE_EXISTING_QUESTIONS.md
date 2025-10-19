# Prompt: Categorize Existing Ortho Questions

## Instructions for LLM

You are an expert orthopedic surgeon helping to categorize medical quiz questions. Below are 66 existing orthopedic questions that need to be assigned to one of 9 categories.

## Categories

1. **Hand and Wrist** - Finger injuries, tendon repairs, carpal bones, wrist fractures, nerve injuries
2. **Shoulder** - Rotator cuff, instability, labral tears, AC joint, special tests
3. **Spine** - Cervical/thoracic/lumbar spine, disc herniations, stenosis, cord injuries, scoliosis
4. **Hip and Pelvis** - Hip fractures, THA, acetabular fractures, AVN, FAI, DDH, pelvic ring injuries
5. **Knee** - Ligament injuries, meniscus, patellofemoral, TKA, pediatric knee conditions
6. **Foot and Ankle** - Ankle fractures, Achilles, talus, calcaneus, Lisfranc, forefoot
7. **Pathology** - Tumors, infections, metabolic bone disease, inflammatory arthritis, osteoarthritis
8. **Paediatrics** - DDH, SCFE, Perthes, Salter-Harris, growth plate injuries, pediatric deformities
9. **Trauma** - Open fractures, compartment syndrome, polytrauma, vascular injuries, fracture complications

## Task

For each question below, assign the MOST APPROPRIATE category based on the primary topic.

## Output Format

Return a CSV with columns: `ID,Category`

Example:
```csv
ID,Category
1,Trauma
2,Shoulder
3,Hip and Pelvis
```

## Questions to Categorize

```csv
ID,Question,OptionA,OptionB,OptionC,OptionD,OptionE,CorrectAnswer,Explanation,ImageURL
22,Which classification system is most commonly used for hip fractures?,Garden classification,AO classification,Lauge-Hansen classification,Salter-Harris classification,Neer classification,A,"The Garden classification is the most widely used system for femoral neck fractures,categorizing them into 4 types based on displacement and angulation on AP radiographs.",
24,What factors would you not consider when deciding which muscle is devitalized during debridement?,Color,Consistency,Compressibility,Capacity to bleed,Contractility,C,"Excise all devitalized tissue. Muscle provides an excellent environment for bacteria to flourish. Thus, extensive debridement of contaminated and devascularized tissue should be completed. Attention to the classic Cs of muscle viability can assist the decision for excision: color, consistency, contractility, and capacity to bleed. Caution should be taken with excision of tendons and ligaments.",
11,A 16-year-old male patient presented to the ED following a varus injury to his right knee which was sustained during a football game. It was noted that he was unable to bear weight. There was a gross effusion of the knee which he held at 5 of flexion and examination showed tenderness over the lateral aspect of the distal femur. He also complained that he was having difficulties dorsiflexing his foot. What other features could he present with?,Difficulties inverting his foot,Tingling sensation on the dorsum of his foot,Numbness at the posteromedial side of the lower leg,Inability to plantarflex his big toe,There is posterior sag of the knee,B,"The case vignette seems to suggest that the patient could be suffering from a LCL tear which is complicated by common peroneal nerve palsy. This is because there is a varus injury and common peroneal nerve palsy is usually associated with foot drop, inability in dorsiflexion and eversion, sensory disturbance of anterolateral side of the lower leg and dorsum of foot.",
58,"An 8 year old girl, Eva, presents with her mother after falling from a trampoline yesterday. She has been unable to walk on her left leg since the accident and is complaining that her ankle is sore. She is otherwise fit and well with no significant PMH. She is on no regular medication, has no known drug allergies. On examination she has a swollen and tender medial malleolus with a markedly reduced ROM. She screams when you touch the medial aspect of her ankle. The foot is neurovascularly intact. No wounds are evident. X-rays which were taken are shown below. What does this X-ray show?",Salter- harris type I,Salter- harris type II,Salter- harris type III,Salter- harris type IV,Salter- harris type V,B,,
42,A 29-year-old man sustains a twisting ankle injury. X-ray shows a Weber B distal fibula fracture with medial clear space widening and a small posterior malleolar fragment involving 20% of the tibial plafond. What is the most appropriate management?,Short leg cast non-weight bearing for 6 weeks,Open reduction and internal fixation of fibula only,Syndesmotic screw fixation without fibular fixation,Fibular ORIF with assessment and fixation of posterior malleolus if unstable,Arthroscopic debridement alone,D,"Weber B with medial clear space widening suggests deltoid/syndesmotic injury and instability, generally requiring fibular ORIF. Posterior malleolus fragments involving about 20% are assessed intraoperatively; fixation is based on instability, displacement, and syndesmotic contribution. Fixing the posterior fragment can restore syndesmotic stability. Casting is inappropriate for unstable injuries.",
14,A 24-year-old woman fell from a horse and landed on her outstretched right arm. Radiographs reveal an elbow dislocation with a type II coronoid fracture and a nonreconstructable comminuted radial head fracture. What is the most appropriate management?,"Radial head resection, ORIF of the coronoid, and MCL repair",Radial head resection and LCL repair,Radial head arthroplasty alone,Radial head arthroplasty and LCL repair,"Radial head arthroplasty, ORIF of the coronoid and LCL repair",E,terrible triad injury of the elbow (dislocation + # of the radial head) requiring treatment of each injury - Implant arthroplasty for the comminuted radial head - ORIF of coronoid - LCL repair - usually avulsed from the lateral epicondyle,
33,What is the most common complication of scaphoid fractures?,Infection,Nonunion,Nerve injury,Compartment syndrome,Malunion,B,Nonunion is the most common complication of scaphoid fractures due to the bone's retrograde blood supply,
16,The 'Hawkins sign' in talus fractures indicates:,Avascular necrosis,Good blood supply,Malunion,Infection,Delayed union,B,A positive Hawkins sign (subchondral radiolucency seen 6-8 weeks post-injury) indicates maintained blood supply to the talar dome and suggests a lower risk of avascular necrosis.,
7,"A 45 year old gentleman complains of elbow pain on movement that's been progressively worsening over the past few months. On examination, you notice tenderness over palpation of the elbow, yet a full active and passive range of motion of said joint. The patient has reproducible pain with his arm pronated and his middle finger extended against resistance. What pathology does this patient likely have?",Osteochondritis dissecans,Cubitus valgus,Radial head fracture,Tennis elbow,Golfer's elbow,D,,
54,"67-year-old man develops sudden severe right arm pain and paresthesia with brachial artery occlusion, thrombocytopenia (60,000/mm³), and prolonged aPTT six days after femur fracture fixation surgery. What is the most likely explanation?",Peripheral arterial disease,Patent foramen ovale,Thrombotic thrombocytopenic purpura,Adverse effect of medication,Fat embolization,D,"Heparin-induced thrombocytopenia is an immune-mediated adverse effect of heparin occurring 5–14 days after initiation, characterized by thrombocytopenia and paradoxical thrombotic events such as arterial occlusion despite elevated aPTT.",
8,"The external fixation was done and the surgery went well. The patient's trachea was extubated and he was then transported to the Postanesthesia Care Unit (PACU). However, during the first hour, his oxygen saturation dropped to 85-90% and hence he is delivered oxygen at 2 litres/min via nasal cannula. However, the saturation does not improve, and the patient seems to develop respiratory distress and appears to be in a confused state. On closer inspection, petechial rash was seen over the patient's chest and he had subconjunctival hemorrhage too. What is the most likely cause of this set of symptoms?",Pulmonary embolism,Sepsis,Fat embolism,Pneumonia,Aspiration pneumonitis,C,"Fat embolism syndrome (FES) typically manifests 24 to 72 hours after the initial insult, but may rarely occur as early as 12 hours or as late as two weeks after the inciting event. Affected patients develop a classic triad: hypoxemia (most common symptom and may mimic ARDS), neurologic abnormalities (range from the development of an acute confusional state and altered level of consciousness to seizures and focal deficits) , and a petechial rash (most often on the nondependent regions of the body including the head, neck, anterior thorax, axillae, and sub-conjunctiva).",
37,What is the most common cause of low back pain?,Herniated disc,Spinal stenosis,Muscle strain/ligament sprain,Spondylolisthesis,Sacroiliitis,C,Non-specific low back pain,often due to muscle strains or ligament sprains
10,"In a patient with a stable thoracolumbar burst fracture and no neurologic deficits, operative treatment has what long-term outcome when compared to non-operative management?",Improved sagittal balance,Decreased pain scores,Improved return-to-work status,Improved function,Increased disability and complications,E,"Evidence supports that in patients with stable thoracolumbar burst fractures without neurologic deficits, there are no advantages to surgical treatment (Wood et al, Gnanenthiran et al, Agus et al",
2,"A patient presents to your clinic complaining of pain over the anterior shoulder. Performing a thorough shoulder exam, you find that the patient has reproducible pain with the arm supinated, the elbow fully extended, and with manual resistance applied in a downward direction. What test is this?",Yergason's,Hawkin's,Neer's,Jobe's empty can,Speed's,E,,
43,The primary stabilizer of the shoulder against anterior dislocation is:,Rotator cuff,Labrum,Biceps tendon,Capsule,Coracoacromial ligament,B,The labrum,particularly the anterior-inferior labrum and associated ligaments (Bankart lesion area)
38,"A 50-year-old man, with a PMHx of long standing diabetes, comes to the sports medicine office because he has pain in his right hip and thigh that has been worsening since he fell while working in his yard two weeks ago. He is also noted to febrile with a temperature of 38.3C. Erythema and warmth are noted over the lateral aspect of the right hip and the proximal aspect of the right thigh. Full range of motion of the hip is noted, and distal sensation and pulses are intact. On laboratory studies, erythrocyte sedimentation rate is 29 mm/hr (normal: 0-15 m/hr). Results of full blood cell count are within normal limits. X-ray studies of the hip show a slightly raised periosteum in the proximal femoral shaft. Which of the following additional diagnostic studies is most appropriate?",CT scan,Indium 111 bone scan,MRI,Technetium 99m bone scan,Ultrasonography,C,"The clinical presentation is characteristic of osteomyelitis, and MRI is the most appropriate study to confirm this diagnosis because it shows loss or blurring of normal fat planes, periostitis, marrow edema and periosteal elevation. A is incorrect because this study is not sensitive for acute osteomyelitis. Option B, indium 111 bone scan, and Option D, technetium 99m bone scan, are incorrect because although these studies might show increased metabolic activity in patients with osteomyelitis, this finding is not distinguishable from post-traumatic injury, cancer, or postoperative findings. Option E, ultrasonography, is incorrect because this study can only show fluid collection next to bone, which is not distinguishable from a traumatic response.",
44,"A 68 year old woman presents to the clinic with severe left hip/groin pain and the inability to weight bear on her left leg. You take a detailed history to elicit her risk factors and send for a hip X-ray, which yields the following findings. What is the most significant risk factor for this pathology?",Previous hip trauma,20 years of weekly alcohol consumption,Previous hip radiation,30 years of traditional chinese medicine (TCM) use,Primary osteoarthritis,D,,
28,"A 28-year-old motorcyclist sustains an open midshaft tibial fracture with periosteal stripping and 10 cm wound contamination with soil. After resuscitation, what is the correct Gustilo-Anderson classification?",Type I,Type II,Type IIIA,Type IIIB,Type IIIC,D,A large contaminated wound with extensive soft-tissue damage and periosteal stripping requiring flap coverage is Type IIIB. Type IIIA has adequate soft tissue for coverage. Type IIIC includes arterial injury requiring repair. Type I and II reflect smaller wounds with less soft-tissue damage.,
19,Which of the following is a common finding in osteoarthritis?,Synovial hypertrophy,Cartilage loss,Pannus formation,Elevated inflammatory markers,Rheumatoid factor elevation,B,Osteoarthritis is characterized by progressive loss of articular cartilage,leading to joint pain and dysfunction.
```

[Note: This is a sample - the full CSV with all 66 questions should be inserted here for the actual categorization task]

## Guidelines for Categorization

1. **Primary focus wins** - If a question involves multiple areas, choose the primary topic
2. **Pediatric cases** - If patient age <18 or involves growth plates → Paediatrics
3. **Trauma context** - Open fractures, polytrauma, complications → Trauma
4. **Infections/tumors** - → Pathology
5. **Specific anatomical region** - Choose the specific region when clear
6. **When unclear** - Use your clinical judgment as an orthopedic surgeon

## Expected Output

A clean CSV file with 66 rows (one per question ID) assigning each to one of the 9 categories.

Save the output to review and can be merged into the main CSV file.
