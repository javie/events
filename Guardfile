guard 'shell' do
	watch(%r{^events\.js}) { |m|
		n m[0], "Changed"
		`ant build`
	}
end
