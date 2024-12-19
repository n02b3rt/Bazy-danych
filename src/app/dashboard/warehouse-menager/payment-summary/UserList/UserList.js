import "./UserList.scss";

export default function UserList({ users }) {
    return (
        <div className="userList">
            <div className="userList__header">
                <div>Imię</div>
                <div>Nazwisko</div>
                <div>Adres</div>
                <div>PESEL</div>
                <div>Konto bankowe</div>
                <div>Pensja</div>
            </div>
            {users.map(user => (
                <div className="userList__row" key={user._id}>
                    <div>{user.name}</div>
                    <div>{user.surname}</div>
                    <div>{user.address}</div>
                    <div>{user.personal_id}</div>
                    <div>{user.bank_account}</div>
                    <div>{user.salary}</div>
                </div>
            ))}
        </div>
    );
}
