#!/usr/bin/env python3
import requests
import sys
import json
from datetime import datetime

class ScandiMotorsAPITester:
    def __init__(self, base_url="https://cars-minsk.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        if headers:
            test_headers.update(headers)
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'

        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            details = f"Status: {response.status_code}, Expected: {expected_status}"
            
            if success:
                try:
                    response_data = response.json()
                    self.log_test(name, True, f"Status: {response.status_code}")
                    return True, response_data
                except:
                    self.log_test(name, True, f"Status: {response.status_code} (no JSON)")
                    return True, {}
            else:
                try:
                    error_data = response.json()
                    self.log_test(name, False, f"{details}, Response: {error_data}")
                except:
                    self.log_test(name, False, f"{details}, Response: {response.text[:200]}")
                return False, {}

        except Exception as e:
            self.log_test(name, False, f"Exception: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test API health"""
        return self.run_test("API Health Check", "GET", "", 200)

    def test_admin_login_success(self):
        """Test admin login with correct password"""
        success, response = self.run_test(
            "Admin Login (Correct Password)",
            "POST",
            "admin/login",
            200,
            data={"password": "autominsk2024"}
        )
        if success and 'token' in response:
            self.token = response['token']
            print(f"   Token received: {self.token}")
            return True
        return False

    def test_admin_login_failure(self):
        """Test admin login with wrong password"""
        success, _ = self.run_test(
            "Admin Login (Wrong Password)",
            "POST",
            "admin/login",
            401,
            data={"password": "wrongpassword"}
        )
        return success

    def test_seed_data(self):
        """Test seeding data"""
        success, response = self.run_test(
            "Seed Data",
            "POST",
            "seed",
            200
        )
        if success:
            print(f"   Seed response: {response.get('message', 'No message')}")
        return success

    def test_get_cars(self):
        """Test getting cars list with new fields"""
        success, response = self.run_test(
            "Get Cars List",
            "GET",
            "cars",
            200
        )
        if success:
            cars_count = len(response) if isinstance(response, list) else 0
            print(f"   Found {cars_count} cars")
            if cars_count >= 6:
                print(f"   ✅ Expected 6+ cars, found {cars_count}")
                
                # Check if cars have new fields
                if cars_count > 0:
                    first_car = response[0]
                    new_fields = ['fuel_type', 'body_type', 'color', 'drive_type', 'power', 'is_from_europe', 'is_commission']
                    missing_fields = [field for field in new_fields if field not in first_car]
                    
                    if missing_fields:
                        print(f"   ⚠️  Missing new fields: {missing_fields}")
                        return False, response
                    else:
                        print(f"   ✅ All new fields present: {new_fields}")
                        
                        # Check for Europe and Commission cars
                        europe_cars = [car for car in response if car.get('is_from_europe')]
                        commission_cars = [car for car in response if car.get('is_commission')]
                        print(f"   Found {len(europe_cars)} European cars, {len(commission_cars)} commission cars")
                
                return True, response
            else:
                print(f"   ⚠️  Expected 6+ cars, found {cars_count}")
                return False, response
        return False, []

    def test_create_submission(self):
        """Test creating a submission"""
        test_submission = {
            "name": "Test User",
            "phone": "+375291234567",
            "message": "Test message from API test",
            "service_type": "general"
        }
        
        success, response = self.run_test(
            "Create Submission",
            "POST",
            "submissions",
            200,
            data=test_submission
        )
        
        if success and 'id' in response:
            print(f"   Submission created with ID: {response['id']}")
            return True, response['id']
        return False, None

    def test_get_submissions(self):
        """Test getting submissions (requires admin token)"""
        if not self.token:
            self.log_test("Get Submissions", False, "No admin token available")
            return False
            
        success, response = self.run_test(
            "Get Submissions (Admin)",
            "GET",
            "submissions",
            200
        )
        
        if success:
            subs_count = len(response) if isinstance(response, list) else 0
            print(f"   Found {subs_count} submissions")
        return success

    def test_get_articles(self):
        """Test getting articles list"""
        success, response = self.run_test(
            "Get Articles List",
            "GET",
            "articles",
            200
        )
        if success:
            articles_count = len(response) if isinstance(response, list) else 0
            print(f"   Found {articles_count} articles")
            if articles_count >= 2:
                print(f"   ✅ Expected 2+ articles, found {articles_count}")
                
                # Check article structure
                if articles_count > 0:
                    first_article = response[0]
                    required_fields = ['id', 'title', 'content', 'slug', 'published', 'created_at']
                    missing_fields = [field for field in required_fields if field not in first_article]
                    
                    if missing_fields:
                        print(f"   ⚠️  Missing article fields: {missing_fields}")
                        return False, response
                    else:
                        print(f"   ✅ All article fields present")
                
                return True, response
            else:
                print(f"   ⚠️  Expected 2+ articles, found {articles_count}")
                return False, response
        return False, []

    def test_get_specific_article(self, article_id):
        """Test getting a specific article"""
        success, response = self.run_test(
            "Get Specific Article",
            "GET",
            f"articles/{article_id}",
            200
        )
        return success, response

    def test_article_crud_operations(self):
        """Test article CRUD operations (requires admin token)"""
        if not self.token:
            self.log_test("Article CRUD Operations", False, "No admin token available")
            return False

        # Test creating an article
        test_article = {
            "title": "Test Article",
            "content": "This is a test article content.\n\nSecond paragraph for testing.",
            "excerpt": "Test article excerpt",
            "image_url": "https://example.com/test-article.jpg",
            "published": True
        }

        success, article_response = self.run_test(
            "Create Article (Admin)",
            "POST",
            "articles",
            200,
            data=test_article
        )

        if not success:
            return False

        article_id = article_response.get('id')
        if not article_id:
            self.log_test("Article CRUD Operations", False, "No article ID returned")
            return False

        print(f"   Created article with ID: {article_id}")

        # Test getting the specific article
        success, _ = self.run_test(
            "Get Specific Article",
            "GET",
            f"articles/{article_id}",
            200
        )

        if not success:
            return False

        # Test updating the article
        update_data = {
            "title": "Updated Test Article",
            "excerpt": "Updated excerpt"
        }

        success, _ = self.run_test(
            "Update Article (Admin)",
            "PUT",
            f"articles/{article_id}",
            200,
            data=update_data
        )

        if not success:
            return False

        # Test deleting the article
        success, _ = self.run_test(
            "Delete Article (Admin)",
            "DELETE",
            f"articles/{article_id}",
            200
        )

        return success

    def test_car_crud_operations(self):
        """Test car CRUD operations (requires admin token)"""
        if not self.token:
            self.log_test("Car CRUD Operations", False, "No admin token available")
            return False

        # Test creating a car
        test_car = {
            "brand": "Test Brand",
            "model": "Test Model",
            "year": 2024,
            "price": 50000,
            "mileage": 0,
            "engine": "Test Engine",
            "transmission": "Автомат",
            "image_url": "https://example.com/test.jpg",
            "description": "Test car description",
            "is_from_europe": True
        }

        success, car_response = self.run_test(
            "Create Car (Admin)",
            "POST",
            "cars",
            200,
            data=test_car
        )

        if not success:
            return False

        car_id = car_response.get('id')
        if not car_id:
            self.log_test("Car CRUD Operations", False, "No car ID returned")
            return False

        print(f"   Created car with ID: {car_id}")

        # Test getting the specific car
        success, _ = self.run_test(
            "Get Specific Car",
            "GET",
            f"cars/{car_id}",
            200
        )

        if not success:
            return False

        # Test updating the car
        update_data = {
            "price": 55000,
            "description": "Updated test car description"
        }

        success, _ = self.run_test(
            "Update Car (Admin)",
            "PUT",
            f"cars/{car_id}",
            200,
            data=update_data
        )

        if not success:
            return False

        # Test deleting the car
        success, _ = self.run_test(
            "Delete Car (Admin)",
            "DELETE",
            f"cars/{car_id}",
            200
        )

        return success

    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting Scandi Motors API Tests")
        print(f"   Base URL: {self.base_url}")
        print("=" * 60)

        # Basic tests
        self.test_health_check()
        
        # Auth tests
        self.test_admin_login_failure()
        self.test_admin_login_success()
        
        # Data seeding
        self.test_seed_data()
        
        # Cars tests
        cars_success, cars_data = self.test_get_cars()
        
        # Articles tests
        articles_success, articles_data = self.test_get_articles()
        if articles_success and articles_data:
            # Test getting a specific article
            first_article_id = articles_data[0]['id']
            self.test_get_specific_article(first_article_id)
        
        # Submissions tests
        submission_success, submission_id = self.test_create_submission()
        self.test_get_submissions()
        
        # CRUD tests (requires admin token)
        self.test_car_crud_operations()
        self.test_article_crud_operations()

        # Print summary
        print("\n" + "=" * 60)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print("❌ Some tests failed!")
            print("\nFailed tests:")
            for result in self.test_results:
                if not result['success']:
                    print(f"   - {result['test']}: {result['details']}")
            return 1

def main():
    tester = ScandiMotorsAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())