namespace StatsCanParser;

using System.Text;

class Program
{
    static readonly Dictionary<string, NameEntry> newNameEntries = new(StringComparer.Ordinal);


    static readonly Dictionary<string, NameEntry> existingNameEntries = new(StringComparer.Ordinal);

    static void Main(string[] args)
    {
        string mPath = "male.csv"; // Path to the tab-delimited file
        string fPath = "female.csv";
        string dbIdsfile = "dbid.csv";

        string matchesFile = "sources.csv"; // Path to output file
        string unmatched = "newrecords.csv"; // Path to output file
        // Read the file content
        string[] idlines = File.ReadAllLines(dbIdsfile, Encoding.UTF8);

        Dictionary<string, int> dbIds = new(StringComparer.Ordinal);

        foreach(string line in idlines)
        {
            if(line.Contains(","))
            {

                string[] parts = line.Split(',');

                int id = int.Parse(parts[0]);
                string name = NormalizeName(parts[1]);


                dbIds.Add(name, id);

            }


        }

        doMatches(fPath, dbIds, false);
        doMatches(mPath, dbIds, true);

        //using StreamWriter writer = new StreamWriter(unmatched);
        //foreach(KeyValuePair<string, NameEntry> entry in newNameEntries)
        //{
        //    writer.WriteLine($"{entry.Value.Name},{entry.Value.Male},{entry.Value.Female}");
        //}

        using StreamWriter ewriter = new StreamWriter(matchesFile);
        foreach(KeyValuePair<string, NameEntry> entry in existingNameEntries)
        {
            ewriter.WriteLine($"{entry.Value.dbId},2");
        }

        //writer.WriteLine($"name,source,male,female");

        //using StreamWriter relatedWriter = new StreamWriter(relatedOutFilePath);
        //relatedWriter.WriteLine($"name_id,similar_name_id");

        //foreach(KeyValuePair<string, NameEntry> entry in nameEntries)
        //{
        //    writer.WriteLine($"{entry.Value.Name},https://www.behindthename.com/,{entry.Value.Male},{entry.Value.Female}");

        //    foreach(string relatedName in entry.Value.RelatedNames)
        //    {


        //        int snId = dbIds[relatedName];
        //        relatedWriter.WriteLine($"{entry.Value.dbId},{snId}");
        //    }

        //}

    }

    static void doMatches(string path, Dictionary<string, int> dbIds, bool male)
    {



        string[] nameLines = File.ReadAllLines(path, Encoding.UTF8);

        foreach(string line in nameLines)
        {
            string[] parts = line.Split(',');

            if(parts.Length >= 4)
            {
                string name = NormalizeName(parts[0]);

                // Normalize the name and related names


                // name in db
                if(dbIds.ContainsKey(name))
                {
                    int dbId = dbIds[name];
                    if(!existingNameEntries.ContainsKey(name))
                    {
                        existingNameEntries.Add(name, new NameEntry { Name = name, dbId = dbId, Female = !male, Male = male });
                    }
                    else
                    {
                        if(male)
                        {
                            existingNameEntries[name].Male = true;
                        }
                        else
                        {
                            existingNameEntries[name].Female = true;
                        }
                    }
                }
                else // name not in db
                {
                    // name already in memory
                    if(newNameEntries.ContainsKey(name))
                    {
                        if(male)
                        {

                            newNameEntries[name].Male = true;
                        }
                        else
                        {
                            newNameEntries[name].Female = true;
                        }


                    }
                    else
                    {
                        newNameEntries.Add(name, new NameEntry(name, male, !male));
                    }
                }




            }
        }






        //// Print the normalized list
        //using StreamWriter writer = new StreamWriter(outFilePath);
        //writer.WriteLine($"name,source,male,female");

        //using StreamWriter relatedWriter = new StreamWriter(relatedOutFilePath);
        //relatedWriter.WriteLine($"name_id,similar_name_id");

        //foreach(KeyValuePair<string, NameEntry> entry in nameEntries)
        //{
        //    writer.WriteLine($"{entry.Value.Name},https://www.behindthename.com/,{entry.Value.Male},{entry.Value.Female}");

        //    foreach(string relatedName in entry.Value.RelatedNames)
        //    {


        //        int snId = dbIds[relatedName];
        //        relatedWriter.WriteLine($"{entry.Value.dbId},{snId}");
        //    }

        //}
    }

    static string NormalizeName(string name)
    {
        // Remove leading/trailing spaces and convert to lowercase
        name = name.Trim().ToLower();

        // Capitalize the first letter of each word
        string[] words = name.Split(' ');
        for(int i = 0; i < words.Length; i++)
        {
            if(!string.IsNullOrEmpty(words[i]))
            {
                char[] letters = words[i].ToCharArray();
                letters[0] = char.ToUpper(letters[0]);
                words[i] = new string(letters);
            }
        }

        // Join the words back into a single string
        string normalizedName = string.Join(" ", words).Trim();

        return normalizedName;
    }
}

class NameEntry
{
    public string? Name
    {
        get; set;
    }
    public bool Male
    {
        get; set;
    }

    public bool Female
    {
        get; set;
    }


    public int dbId
    {
        get; set;
    }

    public List<string>? RelatedNames
    {
        get; set;
    }

    public NameEntry()
    {

    }

    public NameEntry(string name, bool male, bool female)
    {
        this.Name = name;
        this.Male = male;
        this.Female = female;


    }
}