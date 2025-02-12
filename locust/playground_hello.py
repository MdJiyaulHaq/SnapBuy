from locust import HttpUser, task


class PlaygroundUser(HttpUser):
    @task
    def say_hello(self):
        self.client.get("/playground/hello/")
