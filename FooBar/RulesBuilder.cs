namespace FooBar;

public class RulesBuilder
{
    public List<NumStringPair> Pairs { get; } = [];
    public Func<int, NumStringPair, bool> Rule { get; set; } = (idx, pair) => true;
    private readonly HashSet<int> _numSet = [];

    public void EditOrAddPair(int num, string msg, int pos = -1)
    {
        if (_numSet.Contains(num))
        {
            int idx = GetIndexByNum(num);
            if (idx == -1) return;

            bool samePosition = pos == -1 || pos == idx;
            if (samePosition)
            {
                Pairs[idx] = Pairs[idx] with { Msg = msg };
            }
            else if (pos >= Pairs.Count)
            {
                Pairs.RemoveAt(idx);
                Pairs.Add(new NumStringPair(num, msg));
            }
            else
            {
                Pairs.RemoveAt(idx);
                Pairs.Insert(pos, new NumStringPair(num, msg));
            }
        }
        else
        {
            var pair = new NumStringPair(num, msg);

            _numSet.Add(num);
            if (pos < 0 || pos >= Pairs.Count)
                Pairs.Add(pair);
            else
                Pairs.Insert(pos, pair);
        }
    }

    public void RemovePair(int num)
    {
        if (!_numSet.Remove(num)) return;
        int idx = GetIndexByNum(num);
        if (idx == -1) return;
        Pairs.RemoveAt(idx);
    }

    private int GetIndexByNum(int num) => Pairs.FindIndex(item => item.Num == num);
}
