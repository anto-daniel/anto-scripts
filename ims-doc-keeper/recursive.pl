use Data::Dumper;

sub has_key {
  my ($attr, $doc) = @_;

  my ($immed_attr, $remaining_attr, $sub_hash, $dot_pos);

  $dot_pos = index($attr, '.');
  if ($dot_pos == -1) {
    $immed_attr = $attr;
    $remaining_attr = '';
  } else {
    $immed_attr = substr($attr, 0, $dot_pos);
    $remaining_attr = substr($attr, $dot_pos + 1, length($attr) - $dot_pos);
  }

  my $sub_hash = $doc->{$immed_attr};

  if ($sub_hash) {
    if (!$remaining_attr) {
      return $sub_hash;
    } else {
      return has_key($remaining_attr, $sub_hash);
    }
  } else {
    print "No such key $immed_attr\n";
    return undef;
  }

}

