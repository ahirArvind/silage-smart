# FeedWise AI

Build a Complete Prototype: Smart AI-Enabled Rapid Feed & Silage Quality Testing System

Create a modern, professional, responsive web application prototype for SIH Problem Statement 26111: Smart AI-Enabled Rapid Feed and Silage Quality Testing System for Dairy Farmers.

The application should demonstrate an end-to-end solution where a farmer can register a feed/silage sample, upload/capture an image, enter or simulate sensor readings, run an AI analysis, view nutritional/quality results, receive farmer-friendly recommendations, and monitor historical/cloud data.

The application is a prototype/demo, so AI predictions and sensor readings can initially be simulated with realistic demo data. Clearly label simulated results as prototype/demo data.

1. DESIGN

Create a clean agricultural/FoodTech dashboard.

Design requirements:

Modern professional UI

Green/earth-tone agricultural visual language

Mobile-first responsive design

Large buttons suitable for rural farmers

Simple language

Hindi + English language toggle

Clear icons

Cards with easy-to-read results

Avoid overly technical terminology on farmer-facing screens

Use charts where useful

Accessible contrast

Desktop dashboard + mobile responsive layout

Application name:

KrishiFeed AI

Tagline:

AI-Powered Feed & Silage Quality Testing for Dairy Farmers

2. APPLICATION NAVIGATION

Create a sidebar/bottom navigation containing:

Dashboard

New Test

Feed Analysis

Silage Analysis

Test History

Storage Monitoring

Farmer Advisory

Reports

Profile

Settings

Top navigation:

Application logo

Search

Language selector: English / हिंदी

Notifications

Farmer profile

3. DASHBOARD

Create a dashboard showing:

Header

"Good Morning, Farmer"

Subtitle:

"Check your feed and silage quality in minutes."

Main CTA

Large button:

+ Start New Test

Two secondary buttons:

Test Feed

Test Silage

Statistics cards

Show:

Tests Completed

Good Quality Samples

Samples Requiring Attention

Storage Alerts

Example demo values:

Tests Completed: 128

Good Quality: 94

Attention Required: 21

Storage Alerts: 13

Recent Tests

Table/cards:

SampleTypeDateQualityStatusFD-1024Cattle FeedToday86/100GoodSL-1023SilageYesterday72/100AttentionFD-1022Cattle FeedYesterday91/100Good

Clicking a sample opens its detailed report.

Quality Overview

Create a chart showing:

Protein

Moisture

Fibre

Energy

4. NEW TEST FLOW

Create a multi-step testing wizard.

Step 1 — Select Sample

Options:

[ Feed ]

[ Silage ]

Fields:

Sample ID

Feed/Silage type

Batch number

Optional QR code

Date/time

Allow QR scanning as a prototype button.

Step 2 — Capture Sample

Show a large camera/upload area:

Capture Sample Image

Buttons:

[ Open Camera ]

[ Upload Image ]

Show preview after upload.

Below the image show:

"Ensure the sample is evenly spread and well illuminated."

Step 3 — Sensor Data

Display connected sensors:

NIR Spectrometer

Status:

🟢 Connected

Moisture Sensor

Status:

🟢 Connected

pH Sensor

Status:

🟢 Connected

Temperature Sensor

Status:

🟢 Connected

Humidity Sensor

Status:

🟢 Connected

For prototype mode, provide:

Use Demo Sensor Data

When clicked, populate realistic values.

Example:

Moisture: 9.2%

pH: 4.8

Temperature: 27°C

Humidity: 62%

NIR Scan: Complete

5. AI ANALYSIS SCREEN

After clicking:

Run AI Analysis

show an animated scanning/progress screen.

Steps:

Image preprocessing

Computer vision analysis

NIR spectral analysis

Sensor analysis

Feature fusion

AI prediction

Advisory generation

Progress:

0 → 100%

Then automatically navigate to results.

6. AI ARCHITECTURE VISUALIZATION

Create an interactive diagram on the Analysis page:

Sample

↓

Camera + NIR + Sensors

↓

Preprocessing

↓

Computer Vision + Spectral ML + Sensor ML

↓

Feature Fusion

↓

Multimodal AI

↓

Quality Assessment

↓

Farmer Advisory

Allow clicking each block to show a short explanation.

7. FEED ANALYSIS RESULT

Create a detailed report.

Header:

Feed Quality Report

Sample:

FD-1024

Date:

26 September 2026

Overall Quality

Large circular score:

86 / 100

Status:

GOOD QUALITY

Nutritional Parameters

Create cards:

Crude Protein

18.4%

Moisture

9.2%

Fibre

13.8%

Energy

3,150 kcal/kg

Mineral Status

Normal

Clearly label these as:

AI-estimated / prototype values

unless they come from real laboratory measurements.

Contamination Screening

Urea Adulteration:

Low Risk

Sand/Silica:

Low Risk

Fungal Contamination:

Low Risk

Mycotoxin:

Screening Required

Important:

Do not claim laboratory-grade detection of aflatoxin/mycotoxin from ordinary RGB images.

Display:

"AI screening only — laboratory confirmation recommended when contamination is suspected."

Confidence

Show confidence for each prediction.

Example:

Protein prediction: 92%

Moisture prediction: 95%

Adulteration screening: 87%

8. SILAGE ANALYSIS

Create a separate Silage Quality page.

Show:

Overall Silage Quality

72 / 100

Status:

ATTENTION REQUIRED

Parameters

pH:

4.8

Moisture:

61%

Temperature:

31°C

Mould Risk:

Medium

Fermentation Quality:

Good

Spoilage Risk:

Medium

Visual Analysis

Display uploaded silage image.

Overlay a simulated analysis result:

"Potential mould/spoilage region detected"

Use bounding boxes only if an image is actually available.

Silage Recommendation

Example:

"Monitor moisture and storage conditions. Inspect the affected portion and consider laboratory confirmation if mould or toxin contamination is suspected."

9. COMPUTER VISION PAGE

Create a page showing:

Image Analysis

Uploaded feed/silage image

Then show detected features:

Colour abnormality

Texture abnormality

Visible foreign material

Mould-like regions

Create an AI confidence panel.

Example:

Mould probability: 18%

Foreign material probability: 7%

Normal sample probability: 75%

Label all as prototype predictions.

10. NIR SPECTROSCOPY PAGE

Create a visualization of an NIR spectrum.

X-axis:

Wavelength

Y-axis:

Absorbance

Display a smooth demo spectral curve.

Add controls:

Raw spectrum

Preprocessed spectrum

Feature regions

Compare samples

Show extracted prediction cards:

Protein

Moisture

Fibre

Energy

Include:

"Prototype NIR data — connect calibrated spectrometer for real measurements."

11. SENSOR MONITORING

Create a live sensor dashboard.

Cards:

pH

4.8

Normal

Moisture

61%

Attention

Temperature

31°C

Warning

Humidity

68%

Attention

NIR

Connected

Camera

Connected

Use simulated live updates in prototype mode.

Create a line chart showing sensor values over time.

12. STORAGE MONITORING

Create a storage monitoring dashboard.

Show:

Storage Unit A

Temperature: 29°C

Humidity: 65%

Moisture: Normal

Mould Risk: Low

Status:

GOOD

Storage Unit B

Temperature: 34°C

Humidity: 78%

Mould Risk:

HIGH

Status:

ATTENTION

Add alerts:

"High humidity detected."

"Inspect storage conditions."

"Potential spoilage risk."

13. FARMER ADVISORY

Create a simple advisory page.

Do not show complicated ML terminology.

Example:

Feed Advisory

"Your feed appears to have acceptable nutritional quality."

Recommendations:

✓ Maintain dry storage

✓ Keep the feed protected from moisture

✓ Re-test if colour, smell or texture changes

Silage Advisory

"Silage requires monitoring."

Recommendations:

Monitor moisture

Check storage temperature

Inspect for mould

Consider laboratory testing if contamination is suspected

Use severity indicators:

🟢 Good

🟡 Attention

🔴 High Risk

14. TEST HISTORY

Create a searchable history page.

Filters:

Feed

Silage

Date

Quality

Risk

Table:

Sample ID

Type

Date

Protein

Moisture

Quality

Risk

Action

Allow:

[View Report]

[Download Report]

15. REPORT GENERATION

Create a detailed report page with:

Farmer information

Sample information

Image

Nutritional results

Sensor readings

AI predictions

Confidence values

Quality score

Advisory

Timestamp

QR code

Disclaimer

Button:

Download PDF Report

For prototype purposes, generate a downloadable report if supported.

16. QR TRACEABILITY

Every test should receive a unique ID:

Example:

FD-2026-00124

Create a QR code for the sample.

QR scan result should display:

Sample ID

Date

Feed/Silage type

Quality result

Test history

Advisory

17. MULTILINGUAL SUPPORT

Implement language toggle:

English | हिंदी

Translate farmer-facing:

Dashboard

Test

Results

Advisory

Alerts

Reports

Keep technical data labels recognizable.

18. OFFLINE MODE

Create an "Offline Mode" indicator.

When offline:

🟠 Offline

Show:

"Tests can continue using the local AI/demo model."

Store test results locally.

When internet returns:

🟢 Synced

Show:

"12 records synchronized with cloud."

For this prototype, simulate synchronization.

19. CLOUD DASHBOARD

Create an admin/cloud analytics page.

Show:

Total Samples

128

Farmers

42

Average Quality

84%

Attention Samples

21

Storage Alerts

13

Charts:

Tests per day

Feed vs silage tests

Quality distribution

Contamination alerts

Storage temperature

Storage humidity

20. DATABASE STRUCTURE

Create a simple backend/database structure if backend functionality is available.

Tables:

farmers

id

name

language

farm_name

created_at

samples

id

farmer_id

sample_type

batch_number

image_url

created_at

sensor_readings

sample_id

ph

moisture

temperature

humidity

nir_status

predictions

sample_id

protein

fibre

energy

mould_probability

adulteration_probability

quality_score

confidence

advisories

sample_id

risk_level

recommendation

created_at

21. AI SERVICE

Create an abstraction for the AI model.

Use:

/api/analyze

Input:

image

sample_type

NIR data

sensor data

Output:

{
  "quality_score": 86,
  "protein": 18.4,
  "moisture": 9.2,
  "fibre": 13.8,
  "energy": 3150,
  "mould_risk": "low",
  "adulteration_risk": "low",
  "confidence": 0.92,
  "advisory": "Maintain dry storage conditions."
}


For the prototype, return demo predictions rather than pretending to have a trained scientific model.

Keep the AI service modular so a real Python ML API can be connected later.

22. IMPORTANT SAFETY / SCIENTIFIC LABELING

Throughout the application, distinguish:

AI prediction

from

Laboratory-confirmed result

Never display an AI estimate as an official laboratory result.

For aflatoxin/mycotoxin:

Display:

"Screening indicator only. Laboratory confirmation recommended."

23. DEMO DATA

Provide a "Demo Mode".

Demo samples:

Sample 1 — Good Feed

Protein: 18.4%

Moisture: 9.2%

Fibre: 13.8%

Quality: 86/100

Risk: Low

Sample 2 — Poor Feed

Protein: 11.2%

Moisture: 15.8%

Quality: 52/100

Risk: Attention

Sample 3 — Good Silage

pH: 4.2

Moisture: 60%

Mould risk: Low

Quality: 91/100

Sample 4 — Risky Silage

pH: 5.4

Moisture: 69%

Temperature: 34°C

Mould risk: High

Quality: 48/100

Clearly label these values as demo data.

24. LANDING PAGE

Create a professional landing page with:

Hero:

Smart Feed & Silage Testing in Minutes

Subtitle:

"AI-powered nutritional analysis, contamination screening and silage monitoring for dairy farmers."

Buttons:

Start Testing

View Demo

Feature cards:

AI Nutritional Analysis

NIR Spectroscopy

Computer Vision

IoT Sensors

Silage Monitoring

Farmer Advisory

Offline Support

Cloud Traceability

Add a section:

How It Works

Collect Sample

Scan Sample

AI Analysis

Get Results

Follow Advisory

25. FINAL USER JOURNEY

Implement this complete demo flow:

Landing Page

↓

Dashboard

↓

Start New Test

↓

Select Feed/Silage

↓

Upload/Capture Image

↓

Sensor Data

↓

NIR Scan

↓

AI Analysis Animation

↓

Quality Report

↓

Nutritional Analysis

↓

Contamination Screening

↓

Advisory

↓

Save Test

↓

Generate QR

↓

Test History

↓

Cloud Dashboard

26. TECHNICAL PRINCIPLE

The prototype should visually communicate this architecture:

CAMERA
+
NIR
+
IoT SENSORS

↓

PREPROCESSING

↓

COMPUTER VISION
+
SPECTRAL ML
+
SENSOR ML

↓

FEATURE FUSION

↓

MULTIMODAL AI

↓

QUALITY ASSESSMENT

↓

FARMER ADVISORY

↓

MOBILE + CLOUD

27. FINAL REQUIREMENT

Make the prototype look like a real deployable agricultural technology product, not a generic dashboard.

Prioritize:

Easy farmer workflow

Clear results

Strong visual demonstration

AI analysis flow

NIR visualization

Sensor monitoring

Feed analysis

Silage analysis

Advisory

Offline mode

Multilingual UI

Cloud monitoring

QR traceability

All major functions should be accessible from the navigation and connected through a realistic end-to-end demo flow.

Do not use fake claims such as "100% accurate" or "laboratory replacement".

The system should communicate that AI provides rapid screening/estimation, while laboratory testing can be used for confirmation where necessary.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://silage-smart.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7970395d-f7bc-5c67-ae41-5b80328d78ab).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
