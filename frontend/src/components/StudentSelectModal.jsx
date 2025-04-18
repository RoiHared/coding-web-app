export default function StudentSelectModal({
  students,
  selectedBlock,
  selectedStudent,
  setSelectedStudent,
  onConfirm,
  onCancel,
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg relative">
        <h3 className="text-lg font-semibold mb-4">
          Select student for "{selectedBlock.title}"
        </h3>

        <select
          className="w-full mb-4 p-2 border rounded"
          onChange={(e) => setSelectedStudent(e.target.value)}
          value={selectedStudent || ""}
        >
          <option value="">-- Choose student --</option>
          {students.map((s) => (
            <option key={s._id} value={s._id}>
              {s.username}
            </option>
          ))}
        </select>

        <div className="flex justify-between items-center">
          <button
            onClick={onConfirm}
            disabled={!selectedStudent}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            Generate Link
          </button>
          <button onClick={onCancel} className="text-red-500 hover:underline">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
