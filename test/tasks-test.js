let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");

//Assertion Style
chai.should();

chai.use(chaiHttp);

describe("Tasks API", () => {
    /**
     * Test the GET Route
     */
    describe("GET /api/tasks", () => {
        it("It should GET all the tasks", (done) => {
            chai.request(server)
                .get("/api/tasks")
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a("array");
                    response.body.length.should.be.eql(3);
                    done();
                })
        });

        it("It should return 404 when wrong URI passes", (done) => {
            chai.request(server)
                .get("/api/task")
                .end((err, response) => {
                    response.should.have.status(404);
                    done();
                })
        })
    })

    /**
     * Test the GET By Id Route
     */
    describe("GET /api/tasks/:id", () => {
        it("It should GET a task by id", (done) => {
            const taskId = 1
            chai.request(server)
                .get("/api/tasks/"+taskId)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a("object");
                    response.body.should.have.property("id");
                    response.body.should.have.property("name");
                    response.body.should.have.property("completed");
                    response.body.should.have.property("id").eql(1);
                    done();
                })
        });

        it("It should not GET the id which doesn't exist", (done) => {
            const taskId = 12;
            chai.request(server)
                .get("/api/tasks/"+taskId)
                .end((err, response) => {
                    response.should.have.status(404);
                    response.text.should.be.eql("The task with the provided id does not exist");
                    done();
                })
        });
    });


    /**
     * Test the Post Route
     */
    describe("POST /api/tasks", () => {
        it("It should POST a new task", (done) => {
            const task = {
                name: "Task 4",
                completed: false
            }
            chai.request(server)
                .post("/api/tasks")
                .send(task)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a("object");
                    response.body.should.have.property("id").eql(4);
                    response.body.should.have.property("name").eql("Task 4");
                    response.body.should.have.property("completed").eql(false);
                    done();
                })
        });
        it("It should not POST a task without a name property", (done) => {
            const task = {
                completed: false
            }
            chai.request(server)
                .post("/api/tasks")
                .send(task)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.text.should.be.eql("The name should be at least 3 chars long!")
                    done();
                })
        });
    });

    /**
     * Test the PUT Route
     */
    describe("PUT /api/tasks/:id", () => {
        it("It should PUT the existing task", (done) => {
            const taskId = 1;
            const task = {
                name: "Task 1 changed",
                completed: true
            }
            chai.request(server)
                .put("/api/tasks/"+taskId)
                .send(task)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a("object");
                    response.body.should.have.property("id").eql(1);
                    response.body.should.have.property("name").eql("Task 1 changed");
                    response.body.should.have.property("completed").eql(true);
                    done();
                })
        });

        it("It should not PUT an existing task with the name less than 3", (done) => {
            const taskId = 1;
            const task = {
                name: "Ta",
                completed: true
            }
            chai.request(server)
                .put("/api/tasks/"+taskId)
                .send(task)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.text.should.be.eql("The name should be at least 3 chars long!");
                    done();
                })
        });
    });

    /**
     * Test the PATCH Route
     */
    describe("PATCH /api/tasks/:id", () => {
        it("It should PATCH an existing task", (done) => {
            const taskId = 1;
            const task = {
                name: "Task 1 changed again",
            }
            chai.request(server)
                .patch("/api/tasks/"+taskId)
                .send(task)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a("object");
                    response.body.should.have.property("id").eql(1);
                    response.body.should.have.property("name").eql("Task 1 changed again");
                    response.body.should.have.property("completed").eql(true);
                    done();
                })
        });

        it("It should not PATCH an existing task with name less than 3", (done) => {
            const taskId = 1;
            const task = {
                name: "Ta",
            }
            chai.request(server)
                .patch("/api/tasks/"+taskId)
                .send(task)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.text.should.be.eql("The name should be at least 3 chars long!")
                    done();
                })
        });
    });

    /**
     * Test the DELETE Route
     */
    describe("DELETE /api/tasks/:id", () => {
        it("It should DELETE an existing task", (done) => {
            const taskId = 4;
            chai.request(server)
                .delete("/api/tasks/"+taskId)
                .end((err, response) => {
                    response.should.have.status(200);
                    done();
                })
        });

        it("It should not DELETE a task which doesn't exist", (done) => {
            const taskId = 4;
            chai.request(server)
                .delete("/api/tasks/"+taskId)
                .end((err, response) => {
                    response.should.have.status(404);
                    response.text.should.be.eql("The task with the provided id does not exist");
                    done();
                })
        });
    });
})
