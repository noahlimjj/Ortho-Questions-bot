# Chapter-to-Category Mapping

This document maps the "Difficult questions" chapter files to quiz categories.

## Chapter Files Overview

Located in: `Difficult questions/` folder

| File Name | Chapter | Category | Question Count |
|-----------|---------|----------|----------------|
| MCQ_Chapter2_Complete.csv | Ch2 | Hand and Wrist | 30 |
| MCQ_Chapter3_FULL.csv | Ch3 | Shoulder | 30 |
| MCQ_Chapter4_Complete.csv | Ch4 | Spine | 30 |
| MCQ_Chapter5_Complete.csv | Ch5 | Hip and Pelvis | 30 |
| MCQ_Chapter6_Complete.csv | Ch6 | Knee | 30 |
| MCQ_Chapter7_Complete.csv | Ch7 | Foot and Ankle | 30 |
| MCQ_Chapter8_Complete.csv | Ch8 | Pathology | 30 |
| MCQ_Chapter9_Complete.csv | Ch9 | Paediatrics | 30 |

**Total: 240 questions across 8 categories**

## Category Definitions

### 1. Hand and Wrist (Ch2)
- Finger injuries and deformities (swan neck, mallet, Boutonnière)
- Flexor and extensor tendon repairs
- Pulleys (A2, A4)
- Collateral ligament injuries (Stener lesion)
- Scaphoid and carpal bones
- Nerve injuries (median, ulnar, radial)

### 2. Shoulder (Ch3)
- Rotator cuff pathology
- Shoulder instability and dislocation
- Labral tears
- Acromioclavicular joint injuries
- Glenohumeral joint
- Special tests (Jobe's, Speed's, Hawkins, Neer's)

### 3. Spine (Ch4)
- Cervical spine injuries
- Thoracolumbar fractures
- Spinal cord injuries
- Disc herniations
- Spinal stenosis
- Red flag symptoms
- Scoliosis

### 4. Hip and Pelvis (Ch5)
- Hip fractures (intracapsular, extracapsular)
- Total hip replacement
- Hip dislocation
- Acetabular fractures
- Pelvic ring injuries
- Avascular necrosis (AVN)
- Femoro-acetabular impingement (FAI)
- Developmental dysplasia of the hip (DDH)

### 5. Knee (Ch6)
- Ligament injuries (ACL, PCL, MCL, LCL)
- Meniscal tears
- Patellofemoral disorders
- Total knee replacement
- Pediatric knee conditions (Osgood-Schlatter, SCFE)
- Special tests (Lachman, drawer, McMurray)

### 6. Foot and Ankle (Ch7)
- Ankle fractures (Weber classification)
- Achilles tendon injuries
- Lisfranc injuries
- Calcaneal fractures
- Talus fractures (Hawkins sign)
- Plantar fasciitis
- Forefoot deformities

### 7. Pathology (Ch8)
- Bone tumors (benign and malignant)
- Soft tissue tumors
- Metabolic bone disease (Paget's disease, osteoporosis)
- Infection (osteomyelitis, septic arthritis)
- Inflammatory arthritis (rheumatoid, ankylosing spondylitis)
- Osteoarthritis
- Heterotopic ossification

### 8. Paediatrics (Ch9)
- Developmental dysplasia of hip (DDH)
- Slipped capital femoral epiphysis (SCFE)
- Perthes disease
- Salter-Harris fractures
- Osteochondritis dissecans
- Pediatric spine deformities
- Growth plate injuries

### 9. Trauma (Additional/Mixed)
- Open fractures (Gustilo-Anderson classification)
- Compartment syndrome
- Fat embolism syndrome
- Polytrauma management
- Vascular injuries
- Nerve injuries
- Fracture complications

### 10. Uncategorized
- Questions from existing ortho_questions.csv (IDs 1-66)
- Need to be categorized manually or with AI assistance
- Will use CATEGORIZE_EXISTING_QUESTIONS.md prompt

## ID Format

### New Questions (from Difficult questions folder):
- Format: `Ch#_Q##` (e.g., `Ch2_Q1`, `Ch5_Q15`)
- Chapter number indicates category
- Preserves source organization

### Existing Questions (current ortho_questions.csv):
- Format: Numeric IDs (e.g., `1`, `22`, `66`)
- Need categorization (see CATEGORIZE_EXISTING_QUESTIONS.md)
- Will remain as numeric IDs

## Usage in Quiz App

The Category column in ortho_questions.csv will enable:
- **Category filtering**: Select specific topics to study
- **Progress tracking**: Track progress per category
- **Study modes**: Focus on weak areas
- **Balanced selection**: Ensure variety in daily questions

## Notes

- Categories align with standard orthopedic surgery subspecialties
- Some questions may overlap categories (e.g., trauma + specific anatomy)
- Primary category assigned based on main focus of question
- Can be refined over time based on user feedback
