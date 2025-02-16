import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

# Define dataset
data = pd.DataFrame({
    'energy_usage': [100, 200, 300, 400, 500],
    'waste': [1, 2, 3, 4, 5],
    'temperature': [25, 26, 27, 28, 29],
    'co2_emissions': [50, 100, 150, 200, 250]
})

# Split data
X = data[['energy_usage', 'waste', 'temperature']]
y = data['co2_emissions']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Model
model = RandomForestRegressor(n_estimators=10, random_state=42)
model.fit(X_train, y_train)

# Save model
model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "co2_model.pkl")
joblib.dump(model, model_path)

print(f"✅ Model trained and saved successfully at: {model_path}")
