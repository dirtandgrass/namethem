using System.Text;

class Program
{
    static void Main(string[] args)
    {
        string filePath = "names.txt"; // Path to the tab-delimited file
        string dbIdsfile = "dbid.csv";

        string outFilePath = "nameslist.txt"; // Path to output file
        string relatedOutFilePath = "relatedlist.txt"; // Path to output file
        // Read the file content
        string[] lines = File.ReadAllLines(filePath, Encoding.UTF8);
        string[] idlines = File.ReadAllLines(dbIdsfile, Encoding.UTF8);


        Dictionary<string, NameEntry> nameEntries = new(StringComparer.Ordinal);
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

        foreach(string line in lines)
        {
            string[] parts = line.Split('\t');

            if(parts.Length >= 3)
            {
                string name = parts[0];
                string gender = parts[1].ToLower();
                string relatedNamesString = parts[2];

                string[] relatedNames = relatedNamesString.Split(',');



                // Normalize the name and related names
                string normalizedName = NormalizeName(name);
                List<string> normalizedRelatedNames = new List<string>();



                foreach(string relatedName in relatedNames)
                {
                    string normalizedRelatedName = NormalizeName(relatedName);
                    if(normalizedRelatedName.Length > 0)
                        normalizedRelatedNames.Add(normalizedRelatedName);
                }


                bool male = false;
                bool female = false;

                if(gender.IndexOf('m') >= 0)
                {
                    male = true;
                }
                if(gender.IndexOf('f') >= 0)
                {
                    female = true;
                }


                int dbId = dbIds[normalizedName];




                // Create a NameEntry object and add it to the list
                NameEntry entry = new NameEntry(normalizedName, male, female, normalizedRelatedNames, dbId);
                try
                {
                    nameEntries.Add(normalizedName, entry);
                }
                catch(Exception e)
                {
                    //Console.WriteLine(entry.Name);
                }

            }
        }



        // Print the normalized list
        using StreamWriter writer = new StreamWriter(outFilePath);
        writer.WriteLine($"name,source,male,female");

        using StreamWriter relatedWriter = new StreamWriter(relatedOutFilePath);
        relatedWriter.WriteLine($"name_id,similar_name_id");

        foreach(KeyValuePair<string, NameEntry> entry in nameEntries)
        {
            writer.WriteLine($"{entry.Value.Name},https://www.behindthename.com/,{entry.Value.Male},{entry.Value.Female}");

            foreach(string relatedName in entry.Value.RelatedNames)
            {


                int snId = dbIds[relatedName];
                relatedWriter.WriteLine($"{entry.Value.dbId},{snId}");
            }

        }
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
    public string Name
    {
        get;
    }
    public bool Male
    {
        get;
    }

    public bool Female
    {
        get;
    }


    public int dbId
    {
        get;
    }

    public List<string> RelatedNames
    {
        get;
    }

    public NameEntry(string name, bool male, bool female, List<string> relatedNames, int dbId)
    {
        this.Name = name;
        this.Male = male;
        this.Female = female;
        this.RelatedNames = relatedNames;
        this.dbId = dbId;
    }
}