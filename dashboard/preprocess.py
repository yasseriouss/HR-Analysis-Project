import os
import json
import urllib.request
import pandas as pd

def preprocess():
    url = "https://raw.githubusercontent.com/mragpavank/ibm-hr-analytics-attrition-dataset/master/WA_Fn-UseC_-HR-Employee-Attrition.csv"
    print(f"Downloading dataset from {url}...")
    
    try:
        # Download and load the CSV
        temp_csv = "temp_ibm_hr.csv"
        urllib.request.urlretrieve(url, temp_csv)
        df = pd.read_csv(temp_csv)
        print(f"Loaded dataset with shape: {df.shape}")
        
        # Remove the temp file
        if os.path.exists(temp_csv):
            os.remove(temp_csv)
            
        # Drop duplicates (replicating Colab preprocessing)
        df.drop_duplicates(inplace=True)
        print(f"Shape after dropping duplicates: {df.shape}")
        
        # Add calculated columns
        # 1. EmpID: formatted as RM + EmployeeNumber
        df['EmpID'] = df['EmployeeNumber'].apply(lambda x: f"RM{x}")
        
        # 2. AgeGroup: 18-25, 26-35, 36-45, 46-55, 55+
        def get_age_group(age):
            if age <= 25:
                return "18-25"
            elif age <= 35:
                return "26-35"
            elif age <= 45:
                return "36-45"
            elif age <= 55:
                return "46-55"
            else:
                return "55+"
        df['AgeGroup'] = df['Age'].apply(get_age_group)
        
        # 3. SalarySlab: Upto $5K, $5K-$10K, $10K-$15K, $15K+
        def get_salary_slab(income):
            if income <= 5000:
                return "Upto $5K"
            elif income <= 10000:
                return "$5K-$10K"
            elif income <= 15000:
                return "$10K-$15K"
            else:
                return "$15K+"
        df['SalarySlab'] = df['MonthlyIncome'].apply(get_salary_slab)
        
        # Reorder columns to make EmpID, AgeGroup, SalarySlab at the front if preferred, or keep standard order.
        # Let's write as records to JSON
        output_dir = os.path.join("src", "data")
        os.makedirs(output_dir, exist_ok=True)
        output_path = os.path.join(output_dir, "hr_data.json")
        
        # Convert to dictionary and save
        records = df.to_dict(orient="records")
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(records, f, indent=2)
            
        print(f"Successfully preprocessed and saved {len(records)} records to {output_path}!")
        
    except Exception as e:
        print(f"Error during preprocessing: {e}")

if __name__ == "__main__":
    preprocess()
