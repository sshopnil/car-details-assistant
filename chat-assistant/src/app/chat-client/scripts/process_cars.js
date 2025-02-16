import fs from "fs";
import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";
import { HfInference } from "@huggingface/inference";

dotenv.config();
const hf = new HfInference(process.env.HF_TOKEN);
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
});

const jsonData = JSON.parse(fs.readFileSync("/home/shayan/Desktop/InternThings/intern_projects/chat-bot/simple-chatbot/src/app/chatbot-client/scripts/carsNew.json", "utf-8"));
const cars = jsonData.cars;

function formatCarData(car) {
  return `
    Car Model: ${car.carModel}
    Brand: ${car.brand}
    Price Range: ${car.priceRange.min}-${car.priceRange.max} ${car.priceRange.currency}
    Fuel Type: ${car.fuelType}
    Engine Specs: ${car.engineSpecs}
    Mileage: City: ${car.mileage.city}, Highway: ${car.mileage.highway}, Range: ${car.mileage.range} miles
    Safety Features: ${car.safetyFeatures.join(", ")}
    Technology Features: ${car.technologyFeatures.join(", ")}
    Maintenance Cost: ${car.maintenanceCost.annual} ${car.maintenanceCost.currency}
    Resale Value After 3 Years: ${car.resaleValue.after3Years}%
    Best For: ${car.bestFor.join(", ")}
    Pros: ${car.pros.join(", ")}
    Cons: ${car.cons.join(", ")}
    Competitors: ${car.competitors.join(", ")}
    User Reviews: Avg Rating: ${car.userReviews.averageRating}, Total Reviews: ${car.userReviews.totalReviews}
    Common Issues: ${car.commonIssues.join(", ")}
    Body Type: ${car.bodyType}
    Drivetrain: ${car.drivetrain}
    Transmission: ${car.transmissionType}
    Horsepower: ${car.horsepowerAndTorque.horsepower} HP
    Torque: ${car.horsepowerAndTorque.torque} lb-ft
    Acceleration: 0-60 mph in ${car.acceleration.zeroToSixty} ${car.acceleration.unit}
    Top Speed: ${car.topSpeed.speed} ${car.topSpeed.unit}
    Cargo Space: ${car.cargoSpace.volume} ${car.cargoSpace.unit}
    Seating Capacity: ${car.seatingCapacity}
    Towing Capacity: ${car.towingCapacity.weight} ${car.towingCapacity.unit}
    Warranty Details: Basic: ${car.warrantyDetails.basic}, Battery: ${car.warrantyDetails.battery}
    Charging Time: Fast Charge: ${car.chargingTime.fastCharge}, Home Charging: ${car.chargingTime.homeCharging}
    Battery Range: ${car.batteryRange.range} ${car.batteryRange.unit}
    Infotainment System: Screen Size: ${car.infotainmentSystem.screenSize}", Features: ${car.infotainmentSystem.features.join(", ")}
    Climate Control: ${car.climateControl}
    Interior Material: ${car.interiorMaterial}
    Crash Test Ratings: Overall: ${car.crashTestRatings.overall}, Frontal: ${car.crashTestRatings.frontal}, Side: ${car.crashTestRatings.side}, Rollover: ${car.crashTestRatings.rollover}
    Insurance Cost Estimate: ${car.insuranceCostEstimate.annual} ${car.insuranceCostEstimate.currency}
    Annual Maintenance Cost Estimate: ${car.annualMaintenanceCostEstimate.cost} ${car.annualMaintenanceCostEstimate.currency}
    Availability in Market: ${car.availabilityInMarket}
    Popular Color Options: ${car.popularColorOptions.join(", ")}
    Anti-Theft Features: ${car.antiTheftFeatures.join(", ")}
    Security Rating: ${car.securityRating}
    Driver Assistance Systems: ${car.driverAssistanceSystems.join(", ")}
    Remote Locking/Unlocking: ${car.remoteLockingUnlocking}
    Parking Sensors/Camera: Sensors: ${car.parkingSensorsCamera.sensors}, Camera: ${car.parkingSensorsCamera.camera}, Parking Assist: ${car.parkingSensorsCamera.parkingAssist}
    Child Safety Features: ${car.childSafetyFeatures.join(", ")}
    Airbag System: Total: ${car.airbagSystem.total}, Locations: ${car.airbagSystem.locations.join(", ")}
    Braking System: Type: ${car.brakingSystem.type}, ABS: ${car.brakingSystem.abs}, EBD: ${car.brakingSystem.ebd}
    Traction & Stability Control: Traction Control: ${car.tractionAndStabilityControl.tractionControl}, Stability Control: ${car.tractionAndStabilityControl.stabilityControl}, Features: ${car.tractionAndStabilityControl.features.join(", ")}
    Lane Keep Assist: ${car.laneKeepAssist}
    Security Alarm: ${car.securityAlarm}
    Crash Avoidance System: Forward Collision: ${car.crashAvoidanceSystem.forwardCollision}, Blind Spot: ${car.crashAvoidanceSystem.blindSpot}, Rear Cross: ${car.crashAvoidanceSystem.rearCross}
    Keyless Entry: ${car.keylessEntry}
  `;
}

async function generateEmbeddings(text) {
    const response = await hf.featureExtraction({
      model: "BAAI/bge-large-en",
      inputs: text,
    });
    return response;
  }

// Store embeddings in Pinecone
async function storeEmbeddings() {
  const index = pinecone.index(process.env.PINECONE_INDEX_NAME);

  for (const car of cars) {
    const carText = formatCarData(car);
    const embedding = await generateEmbeddings(carText);

    await index.upsert([
      {
        id: car.id.toString(),
        values: embedding,
        metadata: {
          carModel: car.carModel,
          brand: car.brand,
          fuelType: car.fuelType,
          bodyType: car.bodyType,
          drivetrain: car.drivetrain,
          transmission: car.transmissionType,
          horsepower: car.horsepowerAndTorque.horsepower,
          torque: car.horsepowerAndTorque.torque,
          topSpeed: car.topSpeed.speed,
          acceleration: car.acceleration.zeroToSixty,
          seatingCapacity: car.seatingCapacity,
          securityRating: car.securityRating,
          priceMin: car.priceRange.min,
          priceMax: car.priceRange.max,
          availability: car.availabilityInMarket,
        },
      },
    ]);

    console.log(`✅ Stored: ${car.carModel}`);
  }

  console.log("🚀 All car embeddings stored successfully in Pinecone!");
}

// Run the script
storeEmbeddings().catch(console.error);
