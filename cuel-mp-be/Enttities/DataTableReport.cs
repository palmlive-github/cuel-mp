
namespace cuel_mp_be.Enttities
{
    public class DataTableReport
    {
        public DataTableReport(string columnName, Type dataType, bool isNull)
        {
            ColumnName = columnName;
            DataType = dataType;
            IsNull = isNull;
        }

        public string ColumnName { get; set; }
        public Type DataType { get; set; }
        public bool IsNull { get; set; }
    }
}