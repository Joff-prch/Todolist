export class Helper {
    static createSession(session, req) {
        session = req.session;
        session.id = req.body;
        console.log(session);
    }
}